// ─── AATS: Philosopher Avatar Training Data ────────────────────────────────────
// Comprehensive training curriculum for defending SDA faith against philosophical challenges.

import type { AATSAvatarTraining } from "../aatsTrainingData";

// ── Subjects ─────────────────────────────────────────────────────────────────

const subjects = [
  {
    id: "problem-of-evil",
    title: "Problem of Evil",
    description:
      "The logical and evidential arguments from evil against the existence of a good, omnipotent God. Includes the deductive problem (logical incompatibility), the inductive problem (probability), and the existential problem (personal suffering as grounds for disbelief). Philosophers such as J.L. Mackie, William Rowe, and Paul Draper have formulated rigorous versions of these arguments that demand careful engagement.",
  },
  {
    id: "divine-hiddenness",
    title: "Divine Hiddenness",
    description:
      "J.L. Schellenberg's argument that if a perfectly loving God existed, every person capable of a relationship with God would be in a position to participate in that relationship -- yet many sincere seekers do not believe God exists. The existence of reasonable nonbelief is taken as evidence that no perfectly loving God exists. This argument has become one of the most discussed challenges in contemporary philosophy of religion.",
  },
  {
    id: "free-will-vs-omniscience",
    title: "Free Will vs Omniscience",
    description:
      "The tension between divine foreknowledge and human libertarian free will. If God knows infallibly what you will do tomorrow, then it seems you cannot do otherwise -- and if you cannot do otherwise, you are not genuinely free. This dilemma threatens both the coherence of theism and the theological grounding of moral accountability, the problem of evil, and the great controversy narrative.",
  },
  {
    id: "religious-epistemology",
    title: "Religious Epistemology",
    description:
      "The philosophical challenge to the rationality of religious belief. Classical evidentialism demands sufficient evidence for every belief; if the evidence for God falls short, belief is irrational. Reformed epistemology (Plantinga, Wolterstorff) argues that belief in God can be properly basic. The debate addresses whether faith is a virtue or an epistemic vice, and whether religious experience constitutes genuine knowledge.",
  },
  {
    id: "moral-argument-critique",
    title: "Moral Argument Critique",
    description:
      "Philosophical objections to the moral argument for God's existence. The Euthyphro dilemma asks whether something is good because God commands it (making morality arbitrary) or whether God commands it because it is good (making morality independent of God). Critics argue that objective morality can be grounded without God through moral realism, contractualism, or evolutionary ethics, undermining one of theism's most popular arguments.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments = [
  // ── Problem of Evil ──
  {
    id: "philosopher-steelman-logical-evil",
    title: "The Logical Problem of Evil",
    argument:
      "If God is omnipotent, He has the power to prevent all evil. If God is omniscient, He knows about all evil. If God is omnibenevolent, He desires to prevent all evil. Evil exists. Therefore, at least one of these divine attributes must be false, or God does not exist. J.L. Mackie argued that the conjunction of 'God is omnipotent,' 'God is omniscient,' 'God is perfectly good,' and 'Evil exists' forms an inconsistent set. No logically possible world contains all four propositions as true. The theist must surrender at least one attribute or admit that God does not exist.",
    hiddenAssumptions: [
      "An omnipotent God can create any logically possible world, including one with free creatures who always freely choose good -- but Plantinga showed that this may not be feasible if creatures have libertarian freedom (transworld depravity).",
      "A perfectly good being would prevent all evil it can prevent -- but this ignores that some evils may be logically necessary conditions for greater goods (soul-making, character development, genuine love).",
      "There is no morally sufficient reason for God to permit evil even temporarily -- but the great controversy framework provides exactly such a reason: the vindication of God's character before the universe.",
    ],
    sdaResponse:
      "The SDA great controversy theodicy addresses the logical problem of evil directly. God permits evil temporarily not because He lacks power or goodness but because the moral governance of the universe requires that sin be allowed to demonstrate its true character (Nahum 1:9 -- 'Affliction shall not rise a second time'). Alvin Plantinga's free will defense has shown that God and evil are logically compatible: it is possible that God could not create a world containing moral good without also permitting the possibility of moral evil. The SDA framework adds cosmic scope: the controversy began in heaven (Revelation 12:7-9), involves the entire watching universe (1 Corinthians 4:9 -- 'we have been made a spectacle to the whole universe'), and will be resolved at the final judgment when every creature affirms 'just and true are Your ways' (Revelation 15:3). God's character is on trial, and the trial must run its course for the verdict to be eternally settled (Romans 3:4 -- 'Let God be true, and every human being a liar... so that you may be proved right when you speak and prevail when you judge').",
  },
  {
    id: "philosopher-steelman-evidential-evil",
    title: "The Evidential Problem of Evil",
    argument:
      "Even if God and evil are logically compatible, the sheer amount, distribution, and intensity of suffering in the world make God's existence improbable. William Rowe's argument focuses on instances of apparently gratuitous evil -- suffering that serves no discernible greater good. A fawn trapped in a forest fire, dying slowly over days with no human witness, serves no soul-making purpose, teaches no lesson, and builds no character. The probability that an omnipotent, omniscient, perfectly good being would permit such suffering is vanishingly low. The evidential weight of trillions of such instances across natural history renders theism improbable.",
    hiddenAssumptions: [
      "Humans are in an epistemic position to assess whether any given instance of suffering is truly gratuitous -- Stephen Wykstra's CORNEA principle challenges this assumption: our cognitive limitations mean we cannot reliably judge what an omniscient being's reasons might be.",
      "If we cannot see a reason for suffering, there probably is no reason -- but this inference from 'no known reason' to 'no reason' is a noseeum inference that fails when the gap between human and divine cognition is vast.",
      "Natural evil (earthquakes, diseases, animal suffering) cannot serve any purpose in a theistic framework -- but the great controversy involves the whole creation groaning under sin's curse (Romans 8:19-22), not just human moral failure.",
    ],
    sdaResponse:
      "The SDA response to evidential evil draws on the great controversy's cosmic scope. In Job 1:6-12, God permits Satan to afflict Job, and the narrative makes clear that the audience is heavenly, not merely human. Job's suffering served a purpose Job himself could not discern -- the vindication of God's claim that humans can love Him for who He is, not merely for His blessings. This pattern extends to all apparently gratuitous suffering: the great controversy framework holds that every instance of evil is observed by the cosmic audience and contributes to the universe's education about sin's true nature. Paul writes in 1 Corinthians 4:9, 'We have been made a spectacle to the whole universe, to angels as well as to human beings.' The SDA position does not claim we can identify the specific reason for each suffering but that God has morally sufficient reasons grounded in the larger narrative of cosmic vindication. Furthermore, the divine vindication model holds that God will ultimately justify His governance before all creation (Romans 3:4), and the final eradication of evil (Revelation 20-21) demonstrates that suffering is temporary within an eternal horizon.",
  },
  {
    id: "philosopher-steelman-hiddenness",
    title: "The Argument from Divine Hiddenness",
    argument:
      "J.L. Schellenberg argues: (1) If a perfectly loving God exists, every person capable of a personal relationship with God who does not freely resist such a relationship would be in a position to participate in it. (2) Being in such a position requires at least believing that God exists. (3) Some people who are capable and non-resistant nevertheless do not believe God exists (reasonable nonbelievers). (4) Therefore, a perfectly loving God does not exist. The argument is powerful because it targets God's love rather than His power. A loving parent would never hide from a child who sincerely sought them. Yet God, if He exists, permits earnest seekers to live and die in honest unbelief -- a failure of love incompatible with perfect goodness.",
    hiddenAssumptions: [
      "God's primary goal is to maximize explicit propositional belief in His existence -- but God may have reasons to value faith (trust under epistemic uncertainty) over mere cognitive assent, as Hebrews 11:6 suggests.",
      "Non-resistant nonbelief actually exists -- but the SDA position, informed by Romans 1:18-20, holds that God has provided sufficient evidence to all people, and nonbelief always involves some element of suppression or resistance, even if subconscious.",
      "Hiddenness is incompatible with love -- but human relationships show that appropriate distance can serve love. A parent who is omnipresent and overwhelming may prevent the child's autonomous development. God's 'hiddenness' may be the epistemic space necessary for genuine freedom.",
    ],
    sdaResponse:
      "The SDA divine vindication model provides a unique response to the hiddenness argument. God operates under self-imposed constraints during the great controversy because overwhelming His creatures with undeniable manifestations of His presence would compromise the very freedom He seeks to preserve. In Eden, Adam and Eve walked with God face-to-face, yet still chose rebellion. After sin, God veils His glory not from indifference but from the dual necessity of preserving human freedom and allowing the controversy to play out. Romans 1:19-20 teaches that God has made His existence evident through creation, so that all are 'without excuse.' The SDA position draws on Plantinga's reformed epistemology: belief in God can be properly basic, warranted by the internal testimony of the Holy Spirit (the sensus divinitatis) and the evidence of creation. Hiddenness is not God's absence but His restraint -- the restraint of a God who refuses to coerce belief because coerced love is no love at all. Job 1:6-12 shows that God allows His character to be questioned precisely because He trusts that truth will ultimately vindicate Him (Romans 3:4).",
  },
  {
    id: "philosopher-steelman-foreknowledge",
    title: "The Foreknowledge-Freedom Dilemma",
    argument:
      "If God infallibly knew yesterday that you would eat cereal this morning, then it was true yesterday that you would eat cereal this morning. If it was true yesterday, then you could not have done otherwise this morning -- because if you had done otherwise, God's knowledge would have been wrong, which is impossible for an omniscient being. Therefore, if God has exhaustive foreknowledge, you never could have done otherwise in any situation, and libertarian free will is an illusion. This creates a devastating trilemma for traditional theism: either (a) God does not have exhaustive foreknowledge, (b) humans do not have libertarian free will, or (c) these concepts are logically incoherent together. Options (a) and (b) both undermine core Christian doctrines.",
    hiddenAssumptions: [
      "God's knowledge is temporally indexed -- God 'knew yesterday' what you would do today. But if God is timeless or timelessly eternal, His knowledge is not 'before' or 'after' events but simultaneous with all of time, dissolving the temporal precedence that generates the problem.",
      "Infallible foreknowledge entails causal determinism -- but knowing what someone will freely do is not the same as causing them to do it. I can know (by watching) that a friend is about to choose chocolate ice cream without causing that choice.",
      "Libertarian free will requires the ability to do otherwise in exactly identical circumstances -- but this may be an overly strong condition; genuine agency may require only that the agent is the ultimate source of the action, not that alternate possibilities exist.",
    ],
    sdaResponse:
      "SDAs affirm both divine omniscience and genuine human free will as essential to the great controversy framework. The controversy makes no sense if humans (and angels) do not have genuine freedom to choose, and God's prophetic revelations in Daniel and Revelation demonstrate foreknowledge. The resolution lies in understanding that God's knowledge is not causally deterministic -- God knows what free agents will freely choose without causing those choices. Analogously, a time traveler who has seen tomorrow's events knows what will happen but does not cause those events by knowing them. The Boethian solution holds that God exists outside of time and sees all of history in an eternal present -- His knowledge is like watching events unfold rather than predicting them. The SDA emphasis on the investigative judgment (Daniel 7:9-10) and the final vindication of God's justice actually requires genuine freedom: the judgment makes sense only if creatures genuinely chose their destinies. God's foreknowledge and human freedom are complementary within the great controversy: God foresees, but creatures choose, and the great controversy is God's way of demonstrating this before the universe (1 Corinthians 4:9). As Romans 3:4 declares, God will be 'proved right' when He judges -- a vindication that requires genuine, not predetermined, human agency.",
  },
  {
    id: "philosopher-steelman-epistemology",
    title: "The Evidentialist Challenge to Faith",
    argument:
      "W.K. Clifford's principle states: 'It is wrong always, everywhere, and for anyone to believe anything upon insufficient evidence.' Religious belief, on this view, fails the evidentialist standard. The evidence for God -- cosmological arguments, design arguments, religious experience, testimony -- is at best contested and at worst circular. No argument for God's existence commands anything close to universal assent among competent philosophers. Therefore, belief in God is not rationally justified. Moreover, faith is often defined as believing without or against evidence, making it an epistemic vice rather than a virtue. A responsible epistemic agent proportions belief to evidence, and the evidence for theism falls short of the threshold required for rational belief.",
    hiddenAssumptions: [
      "Clifford's principle is self-evident and uncontroversial -- but it is itself a philosophical claim that cannot be established by evidence alone, making it self-referentially incoherent if applied strictly.",
      "The only legitimate evidence is publicly accessible, empirically verifiable evidence -- but this excludes personal experience, moral intuition, aesthetic perception, and the internal witness of the Holy Spirit, all of which may constitute genuine grounds for belief.",
      "Universal agreement among philosophers is necessary for rational belief -- but no philosophical position commands universal assent (not even Clifford's principle), so this standard would eliminate virtually all philosophical beliefs as irrational.",
    ],
    sdaResponse:
      "Alvin Plantinga's reformed epistemology, which resonates deeply with the SDA understanding of faith, provides the definitive response to evidentialism. Plantinga argues that belief in God can be 'properly basic' -- justified not by inference from evidence but by the direct work of the sensus divinitatis, a cognitive faculty designed by God to produce belief in Him when functioning properly in an appropriate environment. Just as belief in other minds, the reliability of memory, and the existence of the external world are properly basic (we do not prove them from more basic beliefs), so belief in God can be warranted without propositional evidence. The SDA position adds that God has not left Himself without witness: creation testifies (Psalm 19:1), conscience testifies (Romans 2:15), fulfilled prophecy in Daniel and Revelation provides publicly verifiable evidence, and the Holy Spirit provides internal confirmation (Romans 8:16). Faith in the SDA understanding is not belief without evidence but trust grounded in sufficient evidence -- the kind of trust exemplified by Job, who said 'Though He slay me, yet will I trust Him' (Job 13:15). The divine vindication model teaches that God has submitted His own character to examination: Job 1:6-12 shows God allowing Satan to test His claims before the heavenly council, and Romans 3:4 affirms that God's truthfulness will ultimately be vindicated before all creation. This is not a God who demands blind faith but one who invites scrutiny because He knows the evidence will bear Him out.",
  },
  {
    id: "philosopher-steelman-euthyphro",
    title: "The Euthyphro Dilemma",
    argument:
      "Plato's Euthyphro dilemma poses a fundamental challenge to theistic ethics: Is something good because God commands it, or does God command it because it is good? If the former (divine command theory), then morality is arbitrary -- God could have commanded torture for fun and it would be 'good.' If the latter, then there is a standard of goodness independent of God, and God is not the ultimate ground of morality. Either way, God cannot be the foundation of objective morality. Modern formulations add force: if God's nature IS the good, then saying 'God is good' is merely tautological ('God is God-like'), and we lose any meaningful moral content in the claim. The moral argument for God's existence collapses because morality either does not need God (if it is independent) or is vacuous (if it just IS God's nature).",
    hiddenAssumptions: [
      "The dilemma is exhaustive -- there are only two options. But the modified divine nature theory (championed by Robert Adams and William Lane Craig) offers a third way: God's commands flow necessarily from His unchanging nature, which IS the good. Morality is neither arbitrary nor independent of God.",
      "Identifying the good with God's nature makes 'God is good' tautological -- but this misunderstands the claim. 'God is good' means God's nature exemplifies the properties we recognize as moral perfections (love, justice, faithfulness). The claim has real content.",
      "Objective morality can be grounded without God -- but secular moral realism faces its own Euthyphro-like problem: what grounds the moral facts? Why do moral properties supervene on natural properties? The explanatory buck must stop somewhere, and theism provides a more parsimonious stopping point.",
    ],
    sdaResponse:
      "The SDA response to the Euthyphro dilemma draws on the biblical teaching that God's moral law is a transcript of His character. The Ten Commandments (Exodus 20:1-17) are not arbitrary decrees that God could have issued differently; they flow necessarily from who God is -- loving, just, holy, and faithful. God could no more command gratuitous cruelty than He could cease to exist, because His commands express His nature. This is the third option the Euthyphro dilemma overlooks: morality is grounded in God's necessary, unchanging nature. The SDA understanding of the great controversy illuminates why this matters: Satan's accusation was precisely that God's law is arbitrary and oppressive (the lie in Eden: 'God knows that when you eat of it your eyes will be opened,' Genesis 3:5). The entire controversy is about whether God's moral governance is just -- and the watching universe (1 Corinthians 4:9) is the jury. The cross answers this: God Himself bore the penalty of His own law to demonstrate that the law is not arbitrary but reflects an inviolable moral reality rooted in divine love. Romans 3:4 declares that God's justice will be vindicated, and the divine vindication model teaches that every creature will ultimately affirm 'just and true are Your ways' (Revelation 15:3). The Euthyphro dilemma dissolves when we understand that God IS the good, not by arbitrary definition, but by the metaphysical necessity of His eternal nature.",
  },
  {
    id: "philosopher-steelman-secular-morality",
    title: "Morality Without God",
    argument:
      "The moral argument for God claims that objective morality requires a divine lawgiver. But multiple secular frameworks provide objective or at least robust moral grounding without God. Moral realism holds that moral facts are brute facts about the world, irreducible to natural facts but no less real. Contractualism (Scanlon) grounds morality in principles that no one could reasonably reject. Evolutionary ethics explains moral intuitions as adaptations that promote social cooperation. Kantian ethics derives moral duties from pure practical reason alone. The theist who claims 'without God, everything is permitted' ignores the rich philosophical landscape of secular moral theory. If morality can be grounded without God, the moral argument collapses, and one of theism's strongest supports is removed.",
    hiddenAssumptions: [
      "Brute moral facts are explanatorily satisfying -- but unexplained moral facts are no better than unexplained physical facts. Theism provides a deeper explanation: moral facts are grounded in the nature of a necessarily existing, perfectly good being.",
      "Evolutionary ethics can ground objective morality -- but evolution only explains why we have certain moral beliefs, not why those beliefs are true. If moral intuitions are survival mechanisms, they track fitness, not truth. The moral realist needs moral intuitions to be reliable truth-detectors, but evolution provides no guarantee of this.",
      "Kantian or contractualist ethics are self-sufficient -- but both face foundational challenges: Why should we be rational in the way Kant requires? Why should we care about principles 'no one could reasonably reject'? These frameworks presuppose values (the dignity of persons, the authority of reason) that cry out for deeper grounding.",
    ],
    sdaResponse:
      "The SDA position is that secular moral frameworks, while containing genuine moral insights, ultimately borrow capital from the theistic worldview they deny. Moral realism posits brute, unexplained moral facts -- but this is explanatorily inferior to grounding morality in a necessarily existing, perfectly good God whose nature IS the good. Evolutionary ethics explains why we believe certain things are wrong but cannot establish that they ARE wrong -- if our moral beliefs are just survival adaptations, the 'morality' of the spider who eats her mate is equally 'valid.' Contractualism and Kantianism presuppose the intrinsic dignity and rationality of persons -- but why do persons have intrinsic dignity in a godless universe? The SDA view grounds human dignity in the imago Dei: we are valuable because we are created in God's image (Genesis 1:27). The Ten Commandments provide the objective moral framework that secular theories grope toward but cannot firmly establish. The great controversy narrative shows that the moral argument is not merely theoretical: Satan's rebellion was precisely a challenge to God's moral authority, and the entire drama of redemption is about vindicating that authority before the watching universe (1 Corinthians 4:9). As Romans 3:4 declares, 'Let God be true, and every human being a liar... that you may be proved right when you speak and prevail when you judge.' Job 1:6-12 shows this vindication process in miniature: Satan challenged God's moral governance of Job, and God allowed the test to proceed because He trusts in the justice of His own character.",
  },
  {
    id: "philosopher-steelman-gratuitous-evil",
    title: "The Argument from Gratuitous Evil",
    argument:
      "Even granting that some evil serves a greater good (soul-making, character development, free will), there exist instances of suffering so extreme, so pointless, and so disproportionate that no conceivable greater good could justify them. The torture and murder of an innocent child, the slow death of animals in natural disasters with no human witness, the centuries of chattel slavery -- these evils are not merely excessive but gratuitous. An omnipotent God could achieve any greater good He desires without permitting such horrors. The existence of even one genuinely gratuitous evil is logically incompatible with a God who is both omnipotent and perfectly good. The theist who appeals to mystery ('God has His reasons') abandons rational theology for blind faith.",
    hiddenAssumptions: [
      "We can reliably identify genuinely gratuitous evil -- but this requires knowing that no possible greater good is served, which requires near-omniscience about the consequences of events across all time.",
      "An omnipotent God can achieve any good without permitting evil -- but this may be logically impossible if the good in question (e.g., genuine freely chosen love, the full revelation of sin's nature) logically requires the possibility of evil.",
      "Appealing to mystery is epistemically irresponsible -- but recognizing cognitive limitations is a hallmark of intellectual humility. We do not accuse a child of irrationality for not understanding why a parent permits a painful medical procedure.",
    ],
    sdaResponse:
      "The SDA great controversy theodicy directly addresses gratuitous evil. Job 1:6-12 is the paradigmatic case: Job's suffering appeared utterly gratuitous from his perspective -- he was righteous, yet he lost everything. But the narrative reveals a cosmic dimension Job could not see: his suffering was a demonstration before the heavenly council that humans can love God for who He is, not merely for His blessings. Satan's accusation was 'Does Job fear God for nothing?' (Job 1:9). Job's faithfulness vindicated God's character and refuted Satan's charge. The SDA position extends this pattern to all apparently gratuitous suffering: in the great controversy, every instance of evil is observed by the cosmic audience (1 Corinthians 4:9) and contributes to the universe's final, irrevocable rejection of sin. God does not owe us an explanation in this life (Job 38-41), but He has promised a final accounting in which every tear is explained and wiped away (Revelation 21:4). The cross is God's supreme answer: He entered the worst gratuitous suffering Himself -- the innocent, sinless Son of God tortured and killed -- and transformed it into the universe's greatest good. If God can redeem even Calvary, no evil is beyond His redemptive reach. Romans 3:4 assures us that when the full picture is revealed, God will be proved right. The divine vindication model teaches that God's patience in permitting suffering is not indifference but strategic restraint -- He endures temporary accusation so that the universe may reach a free, fully informed verdict on His character.",
  },
  {
    id: "philosopher-steelman-religious-diversity",
    title: "The Problem of Religious Diversity for Epistemology",
    argument:
      "The existence of multiple, mutually exclusive religious traditions -- each with sincere, intelligent adherents who claim experiential confirmation of their beliefs -- undermines the epistemic warrant of any particular tradition. If a Hindu, a Muslim, a Christian, and a Buddhist all claim that their religious experience confirms their (incompatible) beliefs, religious experience cannot be a reliable guide to truth. John Hick argued that all religions are culturally conditioned responses to a single transcendent 'Real,' none of which captures ultimate truth. The Christian who claims special epistemic access must explain why millions of equally sincere, equally intelligent people in other traditions are wrong.",
    hiddenAssumptions: [
      "Religious diversity entails that no religion is true -- but disagreement among experts in any field (science, philosophy, history) does not entail that no position in that field is true. Diversity of opinion is compatible with one opinion being correct.",
      "All religious experiences are epistemically on par -- but experiences vary enormously in content, coherence, and consistency with public evidence. The Christian can argue that some experiences are veridical and others are not, just as some perceptual experiences are veridical and some are illusions.",
      "Hick's pluralism is the neutral, default position -- but Hick's claim that all religions are equally valid cultural responses is itself a substantive theological claim that contradicts the self-understanding of every major religion.",
    ],
    sdaResponse:
      "The SDA response to religious diversity draws on both Plantinga's reformed epistemology and the distinctive SDA emphasis on biblical prophecy as publicly verifiable evidence. Plantinga argues that the existence of disagreement does not defeat a properly basic belief if the believer's cognitive faculties are functioning properly in an appropriate epistemic environment. The SDA position adds that Christianity provides evidence that transcends private religious experience: the fulfilled prophecies of Daniel 2, 7, and 8 (the succession of world empires), the 70-week prophecy pointing to Christ's ministry (Daniel 9:24-27), and the 2,300-day prophecy pointing to 1844 and the investigative judgment -- these constitute publicly verifiable, historically anchored evidence that distinguishes biblical faith from subjective religious experience. Furthermore, the great controversy framework explains religious diversity: Satan actively promotes confusion and counterfeits (2 Corinthians 11:14 -- 'Satan himself masquerades as an angel of light'). The existence of counterfeits does not disprove the genuine; it confirms that something genuine exists to be counterfeited. The divine vindication model (Romans 3:4) teaches that God's truth will ultimately be distinguished from all counterfeits when He is 'proved right' before the universe. Job 1:6-12 shows that God allows His truth claims to be tested; 1 Corinthians 4:9 confirms the cosmic scope of this testing.",
  },
  {
    id: "philosopher-steelman-divine-command-objection",
    title: "The Arbitrariness Objection to Divine Command Ethics",
    argument:
      "If morality is grounded in God's commands, then God could command genocide, slavery, or child sacrifice, and these would become morally obligatory. Indeed, critics point to biblical passages where God apparently commands exactly such acts (the conquest of Canaan in Joshua, Abraham's near-sacrifice of Isaac, the death penalty for Sabbath-breaking). This reveals that divine command morality either (a) renders morality arbitrary (God can make anything moral by fiat) or (b) requires theists to accept that genocide was once morally good because God commanded it. Neither horn is acceptable. The moral argument for God collapses because the God invoked as morality's foundation appears, by the Bible's own testimony, to be morally capricious.",
    hiddenAssumptions: [
      "God's commands are arbitrary decrees disconnected from His nature -- but if God's commands necessarily flow from His unchanging, perfectly good nature, they cannot be arbitrary. God cannot command anything contrary to His nature any more than a triangle can have four sides.",
      "The conquest of Canaan and similar passages are straightforward divine endorsements of genocide -- but these events occur within specific historical and redemptive contexts (the Canaanites' extreme depravity, centuries of divine patience, the protection of the messianic line) that the objector ignores.",
      "If God commanded something, it must have been arbitrary -- but the great controversy framework reveals that every divine action is calculated to vindicate God's character before the watching universe, not to demonstrate raw power.",
    ],
    sdaResponse:
      "The SDA response to the arbitrariness objection is grounded in the great controversy theology and the divine nature theory of ethics. God's commands are not arbitrary because they flow necessarily from His unchanging character of love, justice, and holiness. God could no more command gratuitous cruelty than He could cease to exist. The difficult Old Testament passages must be read within the great controversy framework: God operates in a fallen world where every action must balance justice, mercy, the protection of His redemptive plan, and the vindication of His character before the universe (1 Corinthians 4:9). The conquest of Canaan occurred after 400 years of divine patience with Canaanite wickedness (Genesis 15:16) and served to protect the messianic line through which salvation would come to all nations. The SDA position holds that the cross is the ultimate demonstration that God's moral governance is not arbitrary: He Himself bore the full penalty of His own law rather than simply waiving it, proving that the law reflects inviolable moral reality, not divine whim. As Romans 3:4 declares, God's justice will be vindicated, and the divine vindication model -- illustrated in Job 1:6-12 where God submits His governance of Job to Satan's scrutiny -- shows that God does not hide from examination of His moral character. He invites it because He knows His ways are just.",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames = [
  {
    id: "philosopher-mg-socratic-trap",
    name: "The Socratic Trap",
    description:
      "Using a rapid series of leading questions designed not to explore truth but to maneuver the believer into a predetermined conclusion. The philosopher-opponent already knows where the question chain leads and selects each question to narrow the believer's options until they appear forced to concede the opponent's conclusion. This mimics genuine Socratic dialogue but strips it of its truth-seeking character.",
    example:
      "\"Do you agree that a good being prevents suffering when it can? And do you agree God can do anything? And do you agree children suffer? So you agree God is either not good, not powerful, or not real -- which is it?\" -- Each question is framed to permit only one answer, and the conclusion is built into the question sequence.",
    detectionTip:
      "Watch for rapid-fire yes/no questions that seem innocuous individually but build toward a trap. Slow the conversation down. Challenge the hidden premises in each question. For example: 'I agree that a good being prevents suffering when there is no morally sufficient reason to permit it -- but that qualifier changes everything.' Never accept a question's framing uncritically. As Job learned, God's ways are beyond our simplistic either/or categories (Job 42:3).",
  },
  {
    id: "philosopher-mg-definition-shifting",
    name: "Definition Shifting",
    description:
      "Subtly changing the definition of key terms mid-argument to create the illusion that the believer has contradicted themselves. The philosopher uses 'omnipotent' in one sense when arguing (can do anything logically possible), then shifts to another sense when objecting (can do literally anything, including logical impossibilities), or uses 'evil' to mean 'any suffering at all' in one context and 'morally blameworthy action' in another.",
    example:
      "\"You say God is all-powerful? Then He can make a rock so heavy He can't lift it. If He can't, He's not all-powerful. If He can, He's not all-powerful. Either way, omnipotence is incoherent.\" -- This shifts 'omnipotent' from 'can do anything logically possible' to 'can do logically impossible things,' which no serious theologian has ever claimed.",
    detectionTip:
      "Before accepting any argument, define key terms explicitly and hold both sides to those definitions throughout the conversation. When you notice a term being used differently than it was earlier, call it out immediately: 'When we started, we defined omnipotence as the power to do anything logically possible. You're now using it to mean the power to do logically impossible things. These are different claims.' Careful definition is the foundation of clear thinking.",
  },
  {
    id: "philosopher-mg-complexity-overwhelm",
    name: "Complexity Overwhelm",
    description:
      "Burying the believer under layers of technical philosophical jargon, obscure thought experiments, and arcane distinctions designed to make them feel intellectually inadequate rather than to illuminate the issue. The goal is not clarity but intimidation -- to make the believer feel they cannot possibly engage with the argument and should simply defer to the philosopher's conclusion.",
    example:
      "\"Your position entails a violation of the Leibnizian principle of sufficient reason, commits a modal scope fallacy regarding de re and de dicto necessity, and fails to account for the Ramsey-Lewis functionalist analysis of mental properties. Can you address these concerns?\" -- This barrage of technical terminology is designed to overwhelm, not to communicate.",
    detectionTip:
      "Complexity is not the same as depth. Genuine philosophical insight can always be expressed in plain language, even if technical terms add precision. When overwhelmed, say: 'Could you state your core objection in one or two simple sentences?' If the philosopher cannot simplify their argument without losing it, the argument may not be as strong as the jargon suggests. Paul warned against those who deceive with 'persuasive words' that lack substance (Colossians 2:4). Truth is accessible; obscurantism is a tactic.",
  },
  {
    id: "philosopher-mg-false-neutrality",
    name: "The Myth of Neutrality",
    description:
      "Presenting the philosophical position as neutral, objective, and presupposition-free while characterizing the theist's position as biased, faith-based, and prejudiced. The philosopher claims to 'follow the argument wherever it leads' while smuggling in naturalistic presuppositions (that only empirical evidence counts, that the burden of proof falls entirely on the theist, that the default position is non-belief). This asymmetry is itself a philosophical bias disguised as objectivity.",
    example:
      "\"I'm just looking at the evidence objectively. You're the one starting with a predetermined conclusion based on faith. I follow reason; you follow a book.\" -- This ignores that the philosopher also starts with presuppositions (the reliability of reason, the primacy of empirical evidence, the adequacy of naturalism) that are held by faith, not proven by argument.",
    detectionTip:
      "No one comes to any discussion without presuppositions. When someone claims neutrality, expose their hidden starting points: 'You presuppose that empirical evidence is the only legitimate evidence, that naturalism is the default, and that the burden of proof is asymmetric. These are philosophical commitments, not neutral observations. Everyone has a starting point -- the question is whose starting point best accounts for reality.' Plantinga's reformed epistemology shows that the theist's starting point (God exists and has designed us to know Him) is at least as rational as the naturalist's.",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies = [
  {
    id: "philosopher-fallacy-begging-question",
    name: "Begging the Question Against Theism",
    definition:
      "Assuming the conclusion (that God does not exist or that naturalism is true) in the premises of the argument. The philosopher builds naturalistic assumptions into the framework of the debate and then 'concludes' that naturalism is true -- but the conclusion was smuggled into the starting point. This is circular reasoning disguised as rigorous analysis.",
    example:
      "\"There's no evidence for God because everything can be explained by natural causes.\" -- This assumes that natural explanations are complete explanations (metaphysical naturalism), which is the very conclusion the argument is supposed to establish. The premise ('everything can be explained naturally') already presupposes the conclusion ('there is no supernatural').",
    counterMove:
      "Expose the circularity directly: 'Your premise assumes what you're trying to prove. You're saying there's no evidence for God because you've defined evidence in a way that excludes God from the outset. If you assume only natural explanations count, of course you'll conclude that only natural explanations exist. But that's not an argument -- it's a tautology.' Then present evidence on its own terms: fulfilled prophecy (Daniel 2, 7), the fine-tuning of the universe, the origin of information in DNA, and the moral argument -- evidence that naturalism struggles to accommodate.",
  },
  {
    id: "philosopher-fallacy-equivocation",
    name: "Equivocation on 'Faith'",
    definition:
      "Using the word 'faith' to mean 'belief without evidence' and then attacking religious faith as inherently irrational. This conflates two very different meanings of the word: (1) epistemic faith as trust based on evidence (as in 'I have faith my doctor knows what she's doing'), and (2) blind credulity with no evidential basis. By equivocating between these meanings, the philosopher makes religious faith seem inherently unreasonable.",
    example:
      "\"Faith is believing what you know ain't so -- Mark Twain was right. You're asking me to abandon reason for blind belief.\" -- This defines faith as irrationality by definition, then applies that definition to biblical faith, which is actually trust grounded in evidence: the evidence of creation, conscience, fulfilled prophecy, and the historical resurrection.",
    counterMove:
      "Clarify the equivocation: 'Biblical faith is not belief without evidence -- it is trust grounded in evidence. Hebrews 11:1 defines faith as the substance of things hoped for, the evidence of things not seen. The patriarchs trusted God based on His track record of fulfilled promises. Abraham's faith was grounded in decades of God's faithfulness. The SDA understanding of faith is informed by Plantinga's reformed epistemology: belief in God is properly basic, warranted by the sensus divinitatis and confirmed by public evidence such as fulfilled prophecy. Faith and reason are allies, not enemies.'",
  },
  {
    id: "philosopher-fallacy-false-dilemma",
    name: "The False Dilemma of Euthyphro",
    definition:
      "Presenting only two options (morality is arbitrary or morality is independent of God) when a third option exists (morality is grounded in God's necessary nature). This is the classic Euthyphro dilemma, and it is a false dilemma because it omits the modified divine nature theory that has been the mainstream Christian response for centuries.",
    example:
      "\"Either God commands things because they're already good -- in which case God is irrelevant to morality -- or things are good because God commands them -- in which case morality is arbitrary. Take your pick.\" -- This ignores the third option: God's commands flow necessarily from His perfectly good nature, making morality neither arbitrary nor independent of God.",
    counterMove:
      "Name the fallacy and present the third option: 'That's a false dilemma. There's a third possibility you've omitted: God's commands are the necessary expression of His unchanging, perfectly good nature. Morality is not above God (independent) or below God (arbitrary) -- it IS God's nature. God's nature is the ultimate standard of goodness, and His commands faithfully express that nature. This is why the SDA emphasis on God's law as a transcript of His character is so important -- the law is not a set of arbitrary rules but a revelation of who God is.' Reference Robert Adams and William Lane Craig for the modified divine nature theory.",
  },
  {
    id: "philosopher-fallacy-appeal-to-incredulity",
    name: "Appeal to Incredulity",
    definition:
      "Arguing that because a philosophical position seems personally unbelievable or counterintuitive, it must be false. The philosopher expresses disbelief that a loving God would permit suffering, that faith could be rational, or that moral realism requires God -- and treats this personal incredulity as a conclusive argument rather than a starting point for investigation.",
    example:
      "\"I just can't believe that a loving God would allow a child to die of cancer. Any God who would do that isn't worthy of worship.\" -- This is a powerful emotional appeal, but it confuses the inability to see a reason with the absence of a reason. It also smuggles in the assumption that God should prevent all suffering regardless of other considerations.",
    counterMove:
      "Acknowledge the emotional force while exposing the logical gap: 'I share your anguish at the suffering of innocent children -- every compassionate person does. But the fact that we cannot see God's reason for permitting a specific suffering does not mean there is no reason. Job could not see the reason for his suffering, yet the book of Job reveals there was a profound cosmic purpose he could not perceive (Job 1:6-12). Our inability to see all the way to the horizon does not mean the earth has an edge. The SDA great controversy framework provides the cosmic context: suffering is temporary within an eternal horizon, and God Himself entered suffering at the cross to redeem it.'",
  },
];

// ── Counter Strategies ───────────────────────────────────────────────────────

const counterStrategies = [
  {
    subjectId: "problem-of-evil",
    title: "Countering the Problem of Evil with the Great Controversy Theodicy",
    sdaPosition:
      "The SDA great controversy theodicy provides the most comprehensive Christian response to the problem of evil. Evil originated in heaven through Lucifer's free-will rebellion (Isaiah 14:12-14; Ezekiel 28:14-17; Revelation 12:7-9). God did not destroy Satan immediately because the watching universe needed to see sin's full consequences contrasted with God's character of love. The cross of Christ is God's definitive answer: He entered human suffering, bore its full weight, and conquered death. The great controversy framework explains why God permits evil temporarily (to vindicate His character -- Romans 3:4), why the universe observes (1 Corinthians 4:9 -- 'we are made a spectacle to the whole universe'), and why evil will never rise again (Nahum 1:9). Plantinga's free will defense has shown that God and evil are logically compatible; the SDA theodicy adds cosmic scope and narrative depth that no other theological framework matches. The divine vindication model, illustrated in Job 1:6-12, shows that God submits His governance to scrutiny because He trusts in the justice of His own character.",
    keyScriptures: [
      "Job 1:6-12 -- Satan's challenge in the heavenly council reveals the cosmic dimension of suffering. Job's suffering was not meaningless but served to vindicate God's character before the watching universe.",
      "Romans 3:4 -- 'Let God be true, and every human being a liar... so that you may be proved right when you speak and prevail when you judge.' God's justice is on trial and will be vindicated.",
      "1 Corinthians 4:9 -- 'We have been made a spectacle to the whole universe, to angels as well as to human beings.' Human experience has cosmic significance in the great controversy.",
      "Nahum 1:9 -- 'Affliction will not rise up a second time.' The great controversy will be resolved so thoroughly that evil will never recur -- because the universe will have seen sin's full fruitage.",
      "Revelation 15:3 -- 'Just and true are Your ways, O King of the saints.' At the end, every creature will affirm God's justice -- this is the goal of the great controversy.",
      "Revelation 21:4 -- 'He will wipe every tear from their eyes. There will be no more death.' Evil is temporary; God's restoration is eternal.",
    ],
    counterArguments: [
      "Plantinga's free will defense has been widely acknowledged (even by atheist philosopher J.L. Mackie) as having resolved the logical problem of evil. God and evil are logically compatible because a world with genuine free will necessarily includes the possibility of moral evil. The SDA framework extends this: the controversy began with the misuse of angelic free will in heaven.",
      "The evidential problem of evil assumes we can identify genuinely gratuitous evil -- but Job 1:6-12 demonstrates that suffering appearing gratuitous from the human perspective may serve profound purposes visible only from the cosmic perspective. Wykstra's CORNEA principle supports this: our cognitive distance from God is too great for 'no known reason' inferences to carry weight.",
      "The great controversy theodicy explains what other theodicies cannot: why God permits evil to continue across millennia. The answer is that the universe must see the full contrast between God's government of love and Satan's government of selfishness. This is not divine indifference but divine patience -- the patience of a God who would rather endure millennia of accusation than coerce a single creature.",
      "The cross addresses the existential problem of evil: God is not a distant spectator. He entered suffering, bore the worst that evil could inflict, and conquered death. A God who suffers with us and for us cannot be accused of callous indifference to human pain.",
    ],
    closingStatement:
      "The problem of evil is the strongest argument against God, yet it is self-defeating: you cannot call something 'evil' without an objective moral standard, and you cannot have an objective moral standard without a transcendent moral Lawgiver. The SDA great controversy theodicy offers what no secular philosophy can: a coherent explanation of evil's origin in genuine freedom, a cosmic narrative that gives suffering meaning beyond the human perspective (1 Corinthians 4:9), a God who entered our suffering at the cross, and a guaranteed future in which every tear is wiped away and affliction never rises again. As Job testified after encountering God directly: 'My ears had heard of you but now my eyes have seen you' (Job 42:5). Romans 3:4 assures us that the final verdict will vindicate God's character completely. The final chapter has not yet been written, but its Author is trustworthy.",
  },
  {
    subjectId: "divine-hiddenness",
    title: "Countering Divine Hiddenness with the Divine Vindication Model",
    sdaPosition:
      "The SDA divine vindication model provides a unique and powerful response to the problem of divine hiddenness. God operates under self-imposed constraints during the great controversy because overwhelming demonstrations of His presence would compromise the freedom essential to the controversy's resolution. God's 'hiddenness' is not absence but restraint -- the restraint of a God who values freely given love over coerced obedience. In Eden, Adam and Eve experienced God's unmediated presence yet still rebelled; maximal divine manifestation does not guarantee belief or loyalty. The SDA position also draws on Plantinga's reformed epistemology: the sensus divinitatis (the innate cognitive faculty designed to produce awareness of God) has been damaged by sin but not destroyed, and God's Spirit works to restore it. Romans 1:19-20 teaches that God has provided sufficient evidence for all people, meaning that nonbelief always involves some element of suppression or resistance, even if subconscious. The divine vindication model (Romans 3:4) teaches that God's self-disclosure is calibrated to the needs of the great controversy: enough evidence for faith, not so much as to eliminate freedom.",
    keyScriptures: [
      "Job 1:6-12 -- God permits His character to be challenged in the heavenly council, demonstrating that He does not override the controversy process by overwhelming self-revelation.",
      "Romans 1:19-20 -- 'What may be known about God is plain to them, because God has made it plain to them. For since the creation of the world God's invisible qualities -- his eternal power and divine nature -- have been clearly seen.' God is not truly hidden; He has provided sufficient evidence.",
      "Romans 3:4 -- God's truth will be vindicated -- the process of vindication requires that the evidence accumulate through history rather than being imposed by divine fiat.",
      "1 Corinthians 4:9 -- The great controversy is played out before a cosmic audience; God's restraint ensures that the drama is genuine, not staged.",
      "Isaiah 45:15 -- 'Truly you are a God who hides himself.' Scripture itself acknowledges divine hiddenness as a feature of the present age, not a refutation of God's existence.",
      "Hebrews 11:6 -- 'Without faith it is impossible to please God.' Faith -- trust under conditions of epistemic uncertainty -- is God's desired mode of relationship, not mere cognitive certainty.",
    ],
    counterArguments: [
      "Schellenberg's argument assumes God's primary goal is to maximize belief, but the great controversy framework shows God's primary goal is to vindicate His character and secure the universe's free, informed loyalty. These goals require epistemic space -- enough evidence for faith but not so much as to coerce belief.",
      "The existence of 'reasonable nonbelief' is contested. Romans 1:18-20 teaches that suppression of truth is universal -- not necessarily conscious or malicious, but real. The sensus divinitatis has been damaged by sin, not destroyed, and its impairment accounts for nonbelief without requiring that God has failed in His responsibility.",
      "Human relationships demonstrate that appropriate distance can serve love. A parent who is omnipresent, monitoring every action and instantly correcting every mistake, does not produce a mature, independent, loving child but a dependent, resentful one. God's hiddenness is the epistemic space required for moral and spiritual maturation.",
      "The SDA understanding of the investigative judgment (Daniel 7:9-10) adds a critical dimension: God Himself submits to scrutiny. He does not demand blind trust but invites examination of His character across the full span of history. Job 1:6-12 illustrates this in miniature: God allows Satan to question His governance and submits to the test. This is the opposite of arbitrary hiddenness -- it is transparent self-vindication on a cosmic scale.",
    ],
    closingStatement:
      "Divine hiddenness is not God's absence but His patient restraint. In the great controversy, God could end all doubt with a single overwhelming display of power -- but power is precisely what Satan claims God misuses. Instead, God provides sufficient evidence for faith (creation, conscience, prophecy, the cross) while maintaining the epistemic space necessary for genuine freedom. As Isaiah wrote, 'Truly you are a God who hides himself, O God of Israel, the Savior' (Isaiah 45:15). The hidden God is also the saving God. Job 1:6-12 reveals the cosmic dimension behind the veil; Romans 3:4 guarantees that vindication is coming; 1 Corinthians 4:9 assures us that the drama is witnessed by the entire universe. His hiddenness is temporary; His revelation is coming. 'Every eye will see Him' (Revelation 1:7), and on that day, every question about divine hiddenness will be answered by the sight of nail-scarred hands.",
  },
  {
    subjectId: "free-will-vs-omniscience",
    title: "Countering the Foreknowledge-Freedom Dilemma with the Great Controversy Framework",
    sdaPosition:
      "SDAs affirm both divine omniscience (God knows all things, including the future) and genuine human libertarian free will (humans and angels have the real ability to choose otherwise). Both doctrines are essential to the great controversy framework: God's prophetic foreknowledge is demonstrated in Daniel and Revelation, while genuine free will is presupposed by the concepts of moral accountability, the origin of sin, and the judgment. The apparent tension is resolved by understanding that God's knowledge is not causally deterministic. God knows what free agents will freely choose without causing those choices. The Boethian solution (God exists outside of time and perceives all events in an eternal present) and the simple foreknowledge model (God knows the future as fact without determining it) both preserve the compatibility of foreknowledge and freedom within the SDA theological framework. The divine vindication model (Romans 3:4) requires that human choices be genuine: a rigged trial vindicates no one.",
    keyScriptures: [
      "Job 1:6-12 -- God permits a genuine test of Job's character, implying that the outcome is meaningful and not predetermined. The controversy would be pointless if Job's response were causally determined by God's foreknowledge.",
      "Romans 3:4 -- God's vindication in judgment requires that creatures genuinely chose their allegiance. A rigged trial vindicates no one.",
      "1 Corinthians 4:9 -- The spectacle before the universe has dramatic significance only if the actors are free agents, not puppets following a predetermined script.",
      "Daniel 2:28 -- 'There is a God in heaven who reveals mysteries.' God's foreknowledge is demonstrated by fulfilled prophecy, confirming His omniscience.",
      "Deuteronomy 30:19 -- 'I have set before you life and death, blessings and curses. Now choose life.' God presents genuine choices to His creatures, presupposing their ability to choose.",
      "Revelation 22:17 -- 'Let the one who is thirsty come; and let the one who wishes take the free gift of the water of life.' The invitation presupposes genuine freedom to accept or reject.",
    ],
    counterArguments: [
      "The foreknowledge-freedom dilemma conflates knowing with causing. If I watch a live broadcast and see you choose chocolate ice cream, my knowledge of your choice does not cause your choice. Similarly, God's knowledge of future free actions does not cause those actions. Knowledge and causation are distinct.",
      "The Boethian solution holds that God exists outside of temporal sequence and perceives all of history in an eternal present. This dissolves the temporal precedence that generates the dilemma: God does not 'know in advance' but 'sees eternally.' There is no 'before' in which God's knowledge could constrain future actions.",
      "The great controversy absolutely requires genuine free will. If Lucifer's rebellion was predetermined, God Himself is the author of sin. If human choices in the judgment are predetermined, the judgment is a farce. The SDA framework is internally consistent only if freedom is real -- and this consistency is a powerful argument for the compatibility of foreknowledge and freedom.",
      "The SDA understanding of the investigative judgment (Daniel 7:9-10) demonstrates that God treats human choices as genuinely significant. He opens the books and examines the records -- not because He doesn't know the outcomes, but because the universe must see that every person received a genuine opportunity to choose and that God's judgment is perfectly fair (Romans 3:4). Job 1:6-12 is the paradigm: God allows a genuine test, with a real outcome, before the heavenly council.",
    ],
    closingStatement:
      "The foreknowledge-freedom dilemma dissolves when we recognize that knowing is not causing. A God who exists beyond time perceives all of history in an eternal present, seeing free choices as they are freely made. The great controversy demands this: God's prophetic foreknowledge (demonstrated in Daniel's predictions of world empires, fulfilled with stunning precision) and genuine creaturely freedom (demonstrated by the real, consequential choices of angels and humans throughout the controversy) are both essential pillars of the SDA theological framework. They are not in tension; they are in harmony -- the harmony of a God who is both sovereign and just, who knows the end from the beginning yet judges each person according to their freely made choices. As Romans 3:4 declares, God will be proved right -- and 1 Corinthians 4:9 confirms the whole universe is watching this demonstration.",
  },
  {
    subjectId: "religious-epistemology",
    title: "Countering Evidentialism with Reformed Epistemology and Prophetic Evidence",
    sdaPosition:
      "The SDA position on religious epistemology draws on Alvin Plantinga's reformed epistemology while adding the distinctive SDA emphasis on biblical prophecy as publicly verifiable evidence. Plantinga argues that belief in God can be properly basic -- warranted by the sensus divinitatis and the internal testimony of the Holy Spirit, just as belief in other minds, the reliability of memory, and the existence of the external world are properly basic. The SDA position supplements this with evidentiary arguments: the fulfilled prophecies of Daniel (the succession of Babylon, Medo-Persia, Greece, and Rome; the 70-week prophecy pointing to AD 27 and AD 31; the 2,300-day prophecy pointing to 1844), the cosmological argument, the moral argument, and the historical evidence for the resurrection provide a robust cumulative case for theism generally and Adventist Christianity specifically. Faith is not belief without evidence but trust grounded in sufficient evidence -- what Hebrews 11:1 calls 'the substance of things hoped for, the evidence of things not seen.' The divine vindication model teaches that God Himself submits to evidential scrutiny: Job 1:6-12 shows God allowing His claims to be tested, and Romans 3:4 affirms that He will be proved right.",
    keyScriptures: [
      "Job 1:6-12 -- God allows His governance to be tested before the heavenly council, demonstrating that He does not demand blind faith but invites examination of His character.",
      "Romans 1:19-20 -- God has made His existence evident through creation, so that all are without excuse. This is a claim about the evidential sufficiency of general revelation.",
      "Romans 3:4 -- God's truthfulness will be vindicated before all. This presupposes that evidence and argument will ultimately confirm God's claims.",
      "1 Corinthians 4:9 -- The cosmic audience observes the evidence of the great controversy, confirming that God's self-vindication is public, not private.",
      "Daniel 2:28 -- 'There is a God in heaven who reveals mysteries.' Fulfilled prophecy constitutes publicly verifiable evidence for God's existence and knowledge.",
      "Hebrews 11:1 -- 'Faith is the substance of things hoped for, the evidence of things not seen.' Biblical faith has evidential content; it is not blind credulity.",
    ],
    counterArguments: [
      "Clifford's evidentialist principle is self-refuting: the claim 'it is wrong to believe anything on insufficient evidence' is itself not established by evidence but held as a philosophical axiom. By its own standard, it should be rejected. This opens the door for properly basic beliefs, including belief in God.",
      "Plantinga's reformed epistemology shows that the evidentialist's demand for propositional evidence as a precondition for rational belief is too strict. Many of our most fundamental beliefs (in the external world, other minds, the reliability of memory, the uniformity of nature) are properly basic -- held rationally without inference from more basic beliefs. Belief in God can function the same way.",
      "The SDA position adds publicly verifiable evidence to Plantinga's framework: the fulfilled prophecies of Daniel 2 (the succession of Babylon, Medo-Persia, Greece, Rome, and divided Europe) provide historically anchored evidence that transcends private religious experience. These prophecies were written centuries before the events they describe and have been confirmed by secular history.",
      "The divine vindication model (Romans 3:4; Job 1:6-12) shows that God does not ask for blind faith. He submits His own character and claims to examination -- before the heavenly council in Job, before the cosmic audience in the great controversy (1 Corinthians 4:9), and before history through fulfilled prophecy. The cumulative case for theism (cosmological + teleological + moral + historical + prophetic + experiential) is far stronger than any individual argument, and the evidentialist who demands a single knockdown proof sets an unreasonable standard that no worldview, including naturalism, can meet.",
    ],
    closingStatement:
      "Religious belief is not a leap in the dark but a step into the light of evidence. The sensus divinitatis, the testimony of creation, the moral law written on the heart, the fulfilled prophecies of Daniel and Revelation, the historical resurrection of Jesus Christ, and the internal witness of the Holy Spirit together constitute a cumulative case for faith that is rationally compelling. The divine vindication model teaches that God has not asked us to believe blindly; He has submitted His own character to examination (Job 1:6-12) and promised that His truthfulness will be fully vindicated before the entire universe (Romans 3:4; 1 Corinthians 4:9). As Jesus said to Thomas, 'Because you have seen me, you have believed; blessed are those who have not seen and yet have believed' (John 20:29) -- not because seeing is bad, but because trust that extends beyond sight is a deeper and more beautiful response to a God who has already provided so much evidence of His faithfulness.",
  },
  {
    subjectId: "moral-argument-critique",
    title: "Countering the Moral Argument Critique with Divine Nature Ethics",
    sdaPosition:
      "The SDA response to critiques of the moral argument combines the modified divine nature theory of ethics with the great controversy framework. The Euthyphro dilemma is a false dilemma: it presents only two options (morality is arbitrary or morality is independent of God) when a third option exists -- morality is grounded in God's necessary, unchanging nature. God's commands flow from who God is (loving, just, holy, faithful), and since God's nature is metaphysically necessary, morality is neither arbitrary nor independent of God. The great controversy illustrates this: Satan's accusation was precisely that God's moral governance is arbitrary and oppressive. The entire drama of redemption -- from Eden to Calvary to the final judgment -- is about vindicating the claim that God's law is a transcript of His character and that His character is perfect love. The cross is the supreme demonstration: God bore the penalty of His own law rather than waiving it, proving that the moral order is not arbitrary but reflects inviolable reality rooted in divine love. The divine vindication model (Job 1:6-12; Romans 3:4; 1 Corinthians 4:9) shows that God's moral governance is being publicly examined and will be publicly vindicated.",
    keyScriptures: [
      "Job 1:6-12 -- Satan's challenge to God's moral governance of Job is the paradigm of the great controversy: is God's moral order just, or is obedience merely self-interested? God allows the test because He trusts in the justice of His own character.",
      "Romans 3:4 -- 'Let God be true, and every human being a liar... that you may be proved right when you speak and prevail when you judge.' God's moral governance is on trial and will be vindicated.",
      "1 Corinthians 4:9 -- The cosmic audience watches to see whether God's moral law is just. The moral argument is not merely theoretical; it is played out in the great controversy.",
      "Exodus 20:1-17 -- The Ten Commandments are not arbitrary decrees but a transcript of God's character -- love for God (commandments 1-4) and love for neighbor (commandments 5-10).",
      "1 John 4:8 -- 'God is love.' Morality is grounded in God's essential nature, which IS love. This grounds the moral argument in ontology, not mere command.",
      "Romans 2:14-15 -- 'The requirements of the law are written on their hearts.' The moral law is embedded in human nature, providing universal access to moral truth.",
    ],
    counterArguments: [
      "The Euthyphro dilemma is a false dilemma. The modified divine nature theory (Adams, Craig) provides a third option: God's commands flow necessarily from His perfectly good nature. Morality is neither above God (independent standard) nor below God (arbitrary decree) -- it IS God's nature. This dissolves the dilemma's force entirely.",
      "Secular moral frameworks (moral realism, contractualism, evolutionary ethics, Kantianism) all face deeper grounding problems than theistic ethics. Moral realism posits brute, unexplained moral facts. Evolutionary ethics explains moral beliefs without grounding their truth. Contractualism presupposes human dignity without explaining its source. Divine nature ethics provides a deeper, more parsimonious explanation: moral facts are grounded in the nature of a necessarily existing, perfectly good being.",
      "The great controversy demonstrates that the moral argument is not merely academic. Satan's rebellion was a real challenge to God's moral authority, and the entire history of the controversy -- from Lucifer's accusations in heaven to the cross to the final judgment -- is the universe's investigation of whether God's moral governance is just. Job 1:6-12 illustrates this in miniature. When every creature finally affirms 'just and true are Your ways' (Revelation 15:3), the moral argument receives its ultimate validation.",
      "The cross addresses the arbitrariness objection decisively. If God's moral law were arbitrary, He could simply have waived the penalty for sin and saved Himself the agony of Calvary. The fact that God chose to bear the full penalty of His own law rather than set it aside demonstrates that the moral order is not a matter of divine whim but of metaphysical necessity rooted in God's own nature. Romans 3:4 confirms: God will be proved right when He judges.",
    ],
    closingStatement:
      "The moral argument for God withstands philosophical scrutiny because morality is not grounded in arbitrary divine commands but in God's necessary, unchanging, perfectly good nature. The Euthyphro dilemma is a false dilemma, and secular alternatives to theistic ethics face deeper grounding problems than they solve. The SDA great controversy framework elevates the moral argument from academic philosophy to cosmic drama: the entire history of sin and redemption is an investigation of whether God's moral governance is just (1 Corinthians 4:9). Job 1:6-12 shows God submitting His governance to examination; Romans 3:4 guarantees His vindication. The cross is the verdict -- God Himself bore the penalty of His own law, proving that the moral order is no arbitrary decree but the inviolable expression of infinite love. As Romans 3:4 declares, 'Let God be true' -- and so He shall be proved, before every creature in the universe.",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules = [
  // ────── Module 1: Problem of Evil ──────
  {
    id: "philosopher-mod-problem-of-evil",
    subjectId: "problem-of-evil",
    title: "Confronting the Problem of Evil: The Great Controversy Theodicy",
    doctrineBrief:
      "The problem of evil is widely regarded as the strongest philosophical argument against theism. It comes in three forms: the logical problem (God and evil are logically incompatible), the evidential problem (the amount and distribution of suffering makes God's existence improbable), and the existential problem (personal encounters with suffering that make belief in a good God psychologically untenable).\n\nThe logical problem has been largely resolved by Alvin Plantinga's free will defense, which shows that it is logically possible for God to have morally sufficient reasons for permitting evil -- namely, the value of a world containing creatures with genuine libertarian free will. Even atheist philosopher J.L. Mackie acknowledged the force of Plantinga's argument.\n\nThe SDA great controversy theodicy goes beyond Plantinga by providing a comprehensive cosmic narrative. Evil originated in heaven through Lucifer's free-will rebellion (Revelation 12:7-9). God did not destroy Satan immediately because the universe needed to see sin's full consequences. The controversy is a cosmic trial in which God's character is on the stand (Romans 3:4), the universe is the jury (1 Corinthians 4:9), and the cross is God's definitive answer. The promised resolution -- Christ's return, the millennium, and the new earth -- guarantees that evil is temporary and that affliction will never rise a second time (Nahum 1:9).\n\nThe divine vindication model, illustrated in Job 1:6-12, shows that God submits His governance to scrutiny. Satan's challenge -- 'Does Job fear God for nothing?' -- is a microcosm of the great controversy: is God's moral order just, or is obedience merely self-interested? God allows the test because He trusts in the justice of His own character. This framework provides the SDA apologist with resources to address all three forms of the problem of evil: logical (free will + cosmic controversy), evidential (the cosmic perspective reveals purposes invisible from the human vantage point), and existential (the God who suffered on the cross is not indifferent to our pain).",
    steelmanArguments: [
      steelmanArguments[0], // Logical problem of evil
      steelmanArguments[1], // Evidential problem of evil
      steelmanArguments[7], // Gratuitous evil
    ],
    hiddenAssumptions: [
      "An all-good, all-powerful God would prevent ALL evil -- but this assumes that a world without any evil or suffering would be a better world, ignoring the necessity of free will, the value of character development through adversity, and the cosmic scope of the great controversy.",
      "We are in an epistemic position to judge whether God has morally sufficient reasons for permitting specific evils -- but this assumes near-omniscience about the consequences of events across all of time and all of reality, including the cosmic dimension revealed in Job 1:6-12.",
      "The existence of evil counts against God -- but the ability to call something 'evil' presupposes an objective moral standard, which itself requires a moral Lawgiver. The argument from evil borrows moral capital from theism to use against theism.",
      "God's permission of evil is evidence of His absence or impotence -- but the great controversy framework shows it is evidence of His patient strategy of cosmic vindication (Romans 3:4), in which He endures temporary accusation rather than coerce a single creature.",
    ],
    mindGames: [
      mindGames[0], // The Socratic Trap
      mindGames[3], // The Myth of Neutrality
    ],
    fallacies: [
      fallacies[3], // Appeal to Incredulity
      fallacies[0], // Begging the Question
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "philosopher",
    debriefPrompt:
      "Reflect on your engagement with the problem of evil. Were you able to distinguish between the logical, evidential, and existential forms of the argument? Could you explain Plantinga's free will defense and then show how the SDA great controversy theodicy goes beyond it? Did you use Job 1:6-12 to illustrate the cosmic dimension of suffering and the divine vindication model? Did you point to the cross as God's personal entry into human suffering? Could you articulate how Romans 3:4 and 1 Corinthians 4:9 frame the controversy as a cosmic trial? Most importantly, did you balance philosophical rigor with pastoral compassion? What areas need strengthening?",
  },
  // ────── Module 2: Divine Hiddenness ──────
  {
    id: "philosopher-mod-divine-hiddenness",
    subjectId: "divine-hiddenness",
    title: "Confronting Divine Hiddenness: God's Restraint in the Great Controversy",
    doctrineBrief:
      "J.L. Schellenberg's argument from divine hiddenness has become one of the most discussed challenges in contemporary philosophy of religion. The argument runs: a perfectly loving God would ensure that every non-resistant person is in a position to have a relationship with Him. Being in that position requires at least believing God exists. Yet some non-resistant people do not believe God exists. Therefore, a perfectly loving God does not exist.\n\nThe argument is powerful because it targets God's love rather than His power. It asks: why would a loving God hide from those who sincerely seek Him?\n\nThe SDA divine vindication model provides a distinctive and underappreciated response. During the great controversy, God operates under self-imposed constraints. He could overwhelm every person with undeniable manifestations of His presence, but this would compromise the very freedom the controversy requires. The controversy is about whether God's governance is truly loving and just (Romans 3:4); if God coerced belief through overwhelming self-revelation, the controversy would be short-circuited rather than genuinely resolved.\n\nFurther, the SDA position draws on Plantinga's reformed epistemology to argue that the sensus divinitatis (the innate cognitive faculty designed to produce awareness of God) has been damaged by sin but not destroyed. God has provided sufficient evidence through creation (Romans 1:19-20), conscience (Romans 2:14-15), and the Holy Spirit's work; the perception of 'hiddenness' is partly a function of sin's distortion of our God-perceiving faculties, not a function of God's absence.\n\nJob 1:6-12 illustrates the principle: God allows His character to be questioned and tested before the heavenly council rather than overwhelming the controversy with an irresistible display of power. Scripture itself acknowledges divine hiddenness as a feature of the present age: 'Truly you are a God who hides himself, O God of Israel, the Savior' (Isaiah 45:15). Hiddenness is not a refutation of God's existence but a characteristic of the great controversy period, in which God prioritizes freedom over coerced certainty. As 1 Corinthians 4:9 teaches, the entire universe is watching this drama unfold.",
    steelmanArguments: [
      steelmanArguments[2], // Divine hiddenness
      steelmanArguments[8], // Religious diversity
    ],
    hiddenAssumptions: [
      "God's primary obligation is to maximize explicit propositional belief -- but the great controversy framework shows God's primary goal is to vindicate His character (Romans 3:4) and secure free, informed loyalty from His creatures.",
      "Non-resistant nonbelief genuinely exists -- but Romans 1:18-20 teaches that all people have received sufficient evidence, and the perception of hiddenness may result from the sin-damaged sensus divinitatis rather than from God's failure.",
      "Love requires maximal self-disclosure -- but human relationships show that appropriate restraint can serve love. A parent who is constantly hovering does not produce mature, freely loving children.",
      "The absence of irresistible evidence is the same as the absence of sufficient evidence -- but God may provide evidence calibrated to invite faith without compelling it, which is exactly what the great controversy requires (Job 1:6-12).",
    ],
    mindGames: [
      mindGames[1], // Definition Shifting
      mindGames[3], // The Myth of Neutrality
    ],
    fallacies: [
      fallacies[3], // Appeal to Incredulity
      fallacies[1], // Equivocation on 'Faith'
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "philosopher",
    debriefPrompt:
      "Evaluate your response to the divine hiddenness argument. Could you clearly state Schellenberg's argument and identify its key premises? Were you able to challenge the premise that non-resistant nonbelief exists by appealing to Romans 1 and the sin-damaged sensus divinitatis? Did you use the great controversy framework and the divine vindication model (Job 1:6-12; Romans 3:4) to explain why God restrains His self-revelation? Could you show that hiddenness is not absence but the epistemic space necessary for genuine freedom, as demonstrated before the cosmic audience (1 Corinthians 4:9)? What would you strengthen for next time?",
  },
  // ────── Module 3: Free Will vs Omniscience ──────
  {
    id: "philosopher-mod-free-will-omniscience",
    subjectId: "free-will-vs-omniscience",
    title: "Confronting the Foreknowledge-Freedom Dilemma: Knowing Without Causing",
    doctrineBrief:
      "The tension between divine foreknowledge and human free will is one of the oldest problems in philosophical theology. If God knew infallibly at the creation of the world every choice every person would ever make, then those choices appear fixed and inevitable. If they are fixed and inevitable, they are not genuinely free. And if they are not genuinely free, the concepts of moral responsibility, sin, repentance, and judgment lose their meaning.\n\nThis problem is especially acute for SDAs because the great controversy framework requires BOTH divine foreknowledge (God reveals the future in Daniel and Revelation) AND genuine free will (the controversy is meaningful only if creatures genuinely choose their allegiance). If either is sacrificed, the SDA theological framework collapses.\n\nThe resolution lies in carefully distinguishing between knowing and causing. God's knowledge of future free actions is like an observer's knowledge of present free actions -- it tracks the actions without determining them. If I watch you freely choose chocolate ice cream (via a live broadcast), my knowledge that you chose chocolate did not cause your choice. Similarly, a timeless God who 'sees' all of history in an eternal present knows what free agents freely choose without causing those choices.\n\nThe Boethian solution (God is timeless and perceives all events simultaneously) and the simple foreknowledge model (God knows the future as fact without determining it) are both available to SDAs. The divine vindication model reinforces this: Job 1:6-12 shows God permitting a genuine test of Job's character -- a test that would be meaningless if its outcome were predetermined. Romans 3:4 teaches that God's justice will be vindicated in judgment, which requires that human choices be genuine. And 1 Corinthians 4:9 reminds us that the cosmic audience is watching a real drama, not a predetermined script. The SDA framework is internally consistent only if foreknowledge and freedom are compatible -- and the strongest philosophical arguments support this compatibility.",
    steelmanArguments: [
      steelmanArguments[3], // Foreknowledge-freedom dilemma
    ],
    hiddenAssumptions: [
      "God's knowledge is temporally prior to events and therefore causally constrains them -- but if God is timeless, His knowledge is not 'before' events but simultaneous with them, dissolving the temporal precedence problem.",
      "Infallible foreknowledge entails determinism -- but knowledge and causation are logically distinct. Knowing what someone will do is not the same as making them do it.",
      "Libertarian free will requires the ability to do otherwise in exactly identical circumstances -- but this 'principle of alternate possibilities' may be too strong. What matters for freedom is that the agent is the genuine source of the action.",
      "The dilemma shows that omniscience and free will are logically incompatible -- but the Boethian solution and the simple foreknowledge model both demonstrate logical compatibility, and the divine vindication model (Job 1:6-12) presupposes genuine freedom.",
    ],
    mindGames: [
      mindGames[1], // Definition Shifting
      mindGames[2], // Complexity Overwhelm
    ],
    fallacies: [
      fallacies[0], // Begging the Question
      fallacies[2], // False Dilemma
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "philosopher",
    debriefPrompt:
      "Assess your handling of the foreknowledge-freedom dilemma. Could you clearly distinguish between knowing and causing? Were you able to explain the Boethian solution (God's timelessness dissolves temporal precedence) in accessible terms? Did you show why the great controversy REQUIRES both foreknowledge and genuine freedom, and that the SDA framework is internally consistent on this point? Could you use Daniel's prophecies as evidence of foreknowledge and Deuteronomy 30:19 as evidence of genuine freedom? Did you appeal to Job 1:6-12 to show that God permits genuine tests with real outcomes, and to Romans 3:4 and 1 Corinthians 4:9 to show that the cosmic trial requires genuine human agency? Where do you need more philosophical depth?",
  },
  // ────── Module 4: Religious Epistemology ──────
  {
    id: "philosopher-mod-religious-epistemology",
    subjectId: "religious-epistemology",
    title: "Confronting Evidentialism: Is Faith Rational?",
    doctrineBrief:
      "The question of whether religious belief is rational is central to contemporary philosophy of religion. The evidentialist tradition (represented by W.K. Clifford, Bertrand Russell, and the New Atheists) holds that belief is rational only if supported by sufficient evidence. On this view, religious faith -- which is often characterized as believing without or against evidence -- is an epistemic vice, a failure of intellectual responsibility.\n\nAlvin Plantinga's reformed epistemology has revolutionized this debate. Plantinga argues that the evidentialist demand for propositional evidence as a precondition for rational belief is itself unjustified. Many of our most fundamental beliefs -- in the external world, other minds, the reliability of memory, the validity of logic -- are 'properly basic': held rationally without being inferred from more basic beliefs. Plantinga argues that belief in God can similarly be properly basic, warranted by the sensus divinitatis (a cognitive faculty designed by God to produce awareness of Him) when functioning properly in an appropriate epistemic environment.\n\nThe SDA position embraces reformed epistemology while supplementing it with strong evidential arguments. The fulfilled prophecies of Daniel (the succession of world empires, the 70-week prophecy, the 2,300-day prophecy) provide publicly verifiable, historically anchored evidence that distinguishes Christian faith from mere subjective experience. The cosmological, teleological, and moral arguments provide philosophical evidence. The historical evidence for the resurrection provides historical evidence. And the internal witness of the Holy Spirit (Romans 8:16) provides experiential evidence.\n\nThe divine vindication model adds a crucial dimension: God does not demand blind faith. Job 1:6-12 shows God allowing His claims to be tested before the heavenly council. Romans 3:4 affirms that God will be proved right when He judges. 1 Corinthians 4:9 confirms the cosmic scope of this self-vindication. Faith, in the SDA understanding, is not belief without evidence but trust grounded in sufficient evidence. It is the 'substance of things hoped for, the evidence of things not seen' (Hebrews 11:1). The SDA apologist stands on a foundation of properly basic belief, prophetic evidence, philosophical argument, and personal experience -- a cumulative case that is rationally compelling.",
    steelmanArguments: [
      steelmanArguments[4], // Evidentialist challenge
      steelmanArguments[8], // Religious diversity
    ],
    hiddenAssumptions: [
      "Clifford's evidentialist principle is self-evidently true -- but it is a philosophical axiom that cannot be established by evidence alone, making it self-referentially problematic.",
      "Only publicly accessible, empirically verifiable evidence counts -- but this excludes moral intuition, aesthetic perception, personal experience, and the internal witness of the Spirit, all of which may constitute genuine warrant.",
      "Religious experience is unreliable because people in different religions have conflicting experiences -- but the diversity of experiences does not show that ALL experiences are unreliable; it shows that SOME are. The question is which ones track reality, and the SDA position provides publicly verifiable tests (fulfilled prophecy) alongside private experience.",
      "Faith and reason are opposed -- but the biblical understanding of faith is trust grounded in evidence, not belief in spite of evidence. The divine vindication model (Job 1:6-12; Romans 3:4) shows God inviting examination, not demanding credulity.",
    ],
    mindGames: [
      mindGames[2], // Complexity Overwhelm
      mindGames[3], // The Myth of Neutrality
    ],
    fallacies: [
      fallacies[1], // Equivocation on 'Faith'
      fallacies[0], // Begging the Question
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "philosopher",
    debriefPrompt:
      "Review your defense of the rationality of faith. Could you explain Plantinga's reformed epistemology and the concept of properly basic beliefs in accessible language? Were you able to show that Clifford's evidentialist principle is self-refuting? Did you present the SDA evidential arguments (especially fulfilled prophecy in Daniel) as publicly verifiable evidence that goes beyond private religious experience? Could you articulate the divine vindication model -- that God invites examination (Job 1:6-12) and will be proved right (Romans 3:4) before the cosmic audience (1 Corinthians 4:9)? Could you demonstrate that faith is not belief without evidence but trust grounded in sufficient evidence? How would you improve your epistemological defense?",
  },
  // ────── Module 5: Moral Argument Critique ──────
  {
    id: "philosopher-mod-moral-argument",
    subjectId: "moral-argument-critique",
    title: "Confronting Moral Argument Critiques: The Divine Nature Defense",
    doctrineBrief:
      "The moral argument for God's existence is one of the most powerful and intuitive arguments in the theistic arsenal. In its simplest form: (1) If God does not exist, objective moral values and duties do not exist. (2) Objective moral values and duties do exist. (3) Therefore, God exists. This argument has been championed by C.S. Lewis, William Lane Craig, and many others.\n\nPhilosophers have mounted several sophisticated critiques. The Euthyphro dilemma asks whether something is good because God commands it or God commands it because it is good -- either way, the moral argument is supposedly undermined. Secular moral realists argue that objective moral facts exist as brute features of reality, requiring no divine explanation. Evolutionary ethicists claim that our moral intuitions are survival mechanisms, not truth-detectors. Kantians and contractualists offer non-theistic frameworks for grounding moral obligation.\n\nThe SDA response draws on the modified divine nature theory: morality is grounded in God's necessary, unchanging, perfectly good nature. God's commands are neither arbitrary (He could not have commanded torture for fun) nor subject to an independent standard (the good just IS God's nature). The Euthyphro dilemma is a false dilemma because it overlooks this third option.\n\nThe great controversy adds dramatic force: Satan's rebellion was precisely a challenge to the justice of God's moral governance. The entire history of sin and redemption is a cosmic demonstration that God's law is a transcript of His character and that His character is love. Job 1:6-12 shows this in miniature: Satan challenges God's moral governance of Job, and God allows the test. Romans 3:4 guarantees that God's moral governance will be vindicated. 1 Corinthians 4:9 confirms the cosmic scope of this vindication. The cross is the supreme evidence: God bore the penalty of His own law rather than waiving it, proving that the moral order is not arbitrary but reflects the inviolable reality of divine love.\n\nThe SDA apologist who masters both the philosophical arguments and the great controversy narrative will be equipped to defend the moral argument against the most sophisticated philosophical challenges.",
    steelmanArguments: [
      steelmanArguments[5], // Euthyphro dilemma
      steelmanArguments[6], // Morality without God
      steelmanArguments[9], // Arbitrariness objection
    ],
    hiddenAssumptions: [
      "The Euthyphro dilemma is exhaustive -- but the modified divine nature theory provides a third option that dissolves the dilemma entirely.",
      "Secular moral realism is a viable alternative to theistic ethics -- but unexplained brute moral facts are explanatorily inferior to moral facts grounded in a necessarily existing, perfectly good God.",
      "Evolutionary origins of moral intuitions undermine their truth-tracking reliability -- but this applies only if morality is ungrounded. If God designed human nature to have reliable moral intuitions (Romans 2:14-15), evolution is the mechanism by which God instilled the moral sense.",
      "The existence of difficult Old Testament passages (conquest of Canaan, etc.) proves that divine command ethics leads to moral atrocities -- but these passages must be read within the great controversy framework (Job 1:6-12; Romans 3:4; 1 Corinthians 4:9), not as proof-texts for arbitrary divine violence.",
    ],
    mindGames: [
      mindGames[0], // The Socratic Trap
      mindGames[1], // Definition Shifting
    ],
    fallacies: [
      fallacies[2], // False Dilemma (Euthyphro)
      fallacies[1], // Equivocation on 'Faith'
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "philosopher",
    debriefPrompt:
      "Evaluate your defense of the moral argument. Could you clearly state the Euthyphro dilemma and then show why it is a false dilemma by presenting the modified divine nature theory as the third option? Were you able to address secular alternatives (moral realism, evolutionary ethics, contractualism) and show why they face deeper grounding problems than theistic ethics? Could you use the great controversy, the divine vindication model (Job 1:6-12; Romans 3:4), and the cosmic audience (1 Corinthians 4:9) to illustrate that God's moral governance is neither arbitrary nor oppressive? Did you point to the cross as the supreme demonstration that God's law reflects inviolable moral reality? Where would you strengthen your philosophical defense?",
  },
];

// ── Export ────────────────────────────────────────────────────────────────────

export const philosopherTraining: AATSAvatarTraining = {
  avatarId: "philosopher",
  avatarName: "The Philosopher",
  emoji: "\u{1F3DB}\uFE0F", // 🏛️
  color: "border-violet-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
