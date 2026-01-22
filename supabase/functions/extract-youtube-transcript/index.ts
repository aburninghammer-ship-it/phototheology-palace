import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractChannelFromUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/@([^\/\?]+)/i,
    /youtube\.com\/channel\/([^\/\?]+)/i,
    /youtube\.com\/c\/([^\/\?]+)/i,
    /youtube\.com\/user\/([^\/\?]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1].toLowerCase();
  }
  return null;
}

// Fetch transcript using YouTube's timedtext API directly
async function fetchTranscriptDirect(videoId: string): Promise<string | null> {
  try {
    // Try fetching captions list first
    const listUrl = `https://video.google.com/timedtext?type=list&v=${videoId}`;
    const listResponse = await fetch(listUrl);
    
    if (!listResponse.ok) {
      console.log('Failed to fetch caption list');
      return null;
    }
    
    const listXml = await listResponse.text();
    
    // Check if there are any captions available
    if (!listXml.includes('<track')) {
      console.log('No caption tracks found in list');
      return null;
    }
    
    // Extract language code (prefer English)
    let langCode = 'en';
    const langMatch = listXml.match(/lang_code="([^"]+)"/);
    if (langMatch) {
      langCode = langMatch[1];
    }
    
    // Fetch the actual transcript
    const transcriptUrl = `https://video.google.com/timedtext?lang=${langCode}&v=${videoId}`;
    const transcriptResponse = await fetch(transcriptUrl);
    
    if (!transcriptResponse.ok) {
      console.log('Failed to fetch transcript');
      return null;
    }
    
    const transcriptXml = await transcriptResponse.text();
    
    // Parse XML and extract text
    const textMatches = transcriptXml.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
    const segments: string[] = [];
    
    for (const match of textMatches) {
      let text = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, ' ')
        .trim();
      
      if (text) {
        segments.push(text);
      }
    }
    
    if (segments.length > 0) {
      return segments.join(' ');
    }
    
    return null;
  } catch (error) {
    console.error('Direct transcript fetch error:', error);
    return null;
  }
}

// Fallback: Try using innertube API
async function fetchTranscriptInnertube(videoId: string): Promise<{ transcript: string; channelId?: string } | null> {
  try {
    // Use YouTube's internal API
    const innertubeUrl = 'https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    
    const response = await fetch(innertubeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240101.00.00',
            hl: 'en',
            gl: 'US',
          },
        },
        videoId: videoId,
      }),
    });

    if (!response.ok) {
      console.log('Innertube API request failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Extract channel info for validation
    const channelId = data?.videoDetails?.channelId;
    const channelName = data?.videoDetails?.author;
    
    // Look for captions
    const captions = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captions || captions.length === 0) {
      console.log('No captions found in innertube response');
      return null;
    }
    
    // Find English captions or use first available
    let captionUrl = captions[0]?.baseUrl;
    for (const caption of captions) {
      if (caption.languageCode === 'en' || caption.vssId?.includes('.en')) {
        captionUrl = caption.baseUrl;
        break;
      }
    }
    
    if (!captionUrl) {
      console.log('No caption URL found');
      return null;
    }
    
    // Fetch captions
    const captionResponse = await fetch(captionUrl);
    if (!captionResponse.ok) {
      console.log('Failed to fetch caption content');
      return null;
    }
    
    const captionXml = await captionResponse.text();
    
    // Parse XML
    const textMatches = captionXml.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
    const segments: string[] = [];
    
    for (const match of textMatches) {
      let text = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, ' ')
        .trim();
      
      if (text) {
        segments.push(text);
      }
    }
    
    if (segments.length > 0) {
      return { 
        transcript: segments.join(' '),
        channelId: channelId || channelName
      };
    }
    
    return null;
  } catch (error) {
    console.error('Innertube fetch error:', error);
    return null;
  }
}

// Third fallback: Try oEmbed for video info only (no transcript)
async function fetchVideoInfo(videoId: string): Promise<{ channelName?: string } | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return { channelName: data.author_name };
  } catch (error) {
    console.error('oEmbed fetch error:', error);
    return null;
  }
}

async function fetchYouTubeTranscript(videoId: string, churchChannelUrl?: string): Promise<{ transcript: string; channelId?: string }> {
  console.log('Attempting direct timedtext API...');
  
  // Try method 1: Direct timedtext API
  const directTranscript = await fetchTranscriptDirect(videoId);
  if (directTranscript) {
    console.log('Success with direct timedtext API');
    
    // If we need channel validation, fetch video info separately
    if (churchChannelUrl) {
      const videoInfo = await fetchVideoInfo(videoId);
      if (videoInfo?.channelName) {
        const churchChannelId = extractChannelFromUrl(churchChannelUrl);
        if (churchChannelId) {
          const videoChannelNormalized = videoInfo.channelName.toLowerCase().replace(/\s+/g, '');
          const isFromChurch = videoChannelNormalized.includes(churchChannelId) || 
                               churchChannelId.includes(videoChannelNormalized);
          
          if (!isFromChurch) {
            console.log(`Channel validation failed. Church: ${churchChannelId}, Video: ${videoInfo.channelName}`);
            throw new Error('This video is not from your church\'s YouTube channel. Only videos from your registered channel can be used.');
          }
        }
      }
    }
    
    return { transcript: directTranscript };
  }
  
  console.log('Attempting innertube API...');
  
  // Try method 2: Innertube API
  const innertubeResult = await fetchTranscriptInnertube(videoId);
  if (innertubeResult) {
    console.log('Success with innertube API');
    
    // Validate channel if required
    if (churchChannelUrl && innertubeResult.channelId) {
      const churchChannelId = extractChannelFromUrl(churchChannelUrl);
      if (churchChannelId) {
        const videoChannelNormalized = innertubeResult.channelId.toLowerCase().replace(/\s+/g, '');
        const isFromChurch = videoChannelNormalized.includes(churchChannelId) || 
                             churchChannelId.includes(videoChannelNormalized);
        
        if (!isFromChurch) {
          console.log(`Channel validation failed. Church: ${churchChannelId}, Video: ${innertubeResult.channelId}`);
          throw new Error('This video is not from your church\'s YouTube channel. Only videos from your registered channel can be used.');
        }
      }
    }
    
    return innertubeResult;
  }
  
  throw new Error('Could not extract transcript. Please ensure the video has closed captions enabled, or try pasting the transcript directly.');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl, churchChannelUrl } = await req.json();
    
    if (!youtubeUrl) {
      return new Response(
        JSON.stringify({ error: 'YouTube URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Extracting transcript for video: ${videoId}`);
    if (churchChannelUrl) {
      console.log(`Validating against church channel: ${churchChannelUrl}`);
    }
    
    const result = await fetchYouTubeTranscript(videoId, churchChannelUrl);
    
    if (!result.transcript || result.transcript.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Could not extract sufficient transcript from this video. Try pasting the transcript manually.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Extracted transcript length: ${result.transcript.length} characters`);
    
    return new Response(
      JSON.stringify({ 
        transcript: result.transcript,
        videoId,
        characterCount: result.transcript.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error extracting transcript:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract transcript';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
