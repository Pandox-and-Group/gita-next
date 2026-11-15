# Content audit — November 2026

All 701 verses and the 18 chapter summaries were checked against outside sources, corrected, and extended.
This file says what was compared with what, what changed, and what is still unverified.
Full lists: [audit-issues.md](audit-issues.md) (every finding in the teachings), [audit-threads.md](audit-threads.md) (every thread that was rewritten) and [audit-verses.md](audit-verses.md) (sources per verse).

## Sources

| Source | Used for | Where |
|---|---|---|
| Gita Supersite, IIT Kanpur: all 701 verses compared through the copy in the gita/gita dataset; 12 verses also checked directly on the site | Sanskrit text, second copy of the Sivananda translation | https://www.gitasupersite.iitk.ac.in · https://github.com/gita/gita |
| Critical edition of the Mahābhārata (BORI), GRETIL e-text by M. Tokunaga, rev. J. Smith | Sanskrit text (700 verses; lacks 13.1) | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/ext/bhgce__u.htm |
| vedicscriptures/bhagavad-gita dataset | The app's original text and translation; the commentaries below | https://github.com/vedicscriptures/bhagavad-gita |
| Śaṅkara, Gītā-bhāṣya (English, Swami Gambhirananda) | Advaita view; checking the teachings | in the dataset above |
| Rāmānuja, Gītā-bhāṣya (English, Swami Adidevananda) | Viśiṣṭādvaita view; checking the teachings | in the dataset above |
| Abhinavagupta, Gītārtha-saṅgraha (English, S. Sankaranarayan) | Kashmir Śaiva view | in the dataset above |
| Śrīdhara Svāmī, Subodhinī (Sanskrit) | Bhakti view | in the dataset above |
| Swami Sivananda, The Bhagavad Gita (Divine Life Society) | Translation shown in the app; word lists; practice view | in the dataset above |
| Translations by Gambhirananda, Adidevananda, Sankaranarayan | Checking what each verse says | in the dataset above |
| Swami Mukundananda, Bhagavad Gita: The Song of God | Bhakti-yoga view; the scripture references (Upanishads and others) he cites | https://www.holy-bhagavad-gita.org |

Commentaries and the holy-bhagavad-gita.org text are paraphrased in a sentence or two and credited; nothing is copied at length.

## What was checked, and how

1. **Sanskrit text** — every verse compared by script with Gita Supersite, the critical edition and the original dataset, after normalising sandhi spelling (class nasal / anusvāra, avagraha, daṇḍas). Each verse records which editions it matches (`checked`: S, G, V).
   Result: 597 verses match all three, 96 match two, 8 match one, 0 match none exactly. A mismatch with one edition is nearly always a known variant reading or a typo in that edition, not in the app.
2. **Transliteration** — regenerated mechanically from the Devanagari and compared with the stored IAST.
3. **Translation** — compared with the Sivananda text in the source dataset and with a second copy.
4. **Teachings** (essence, explanation, thread, reflection, background, school notes) — every verse read against the Sanskrit, three independent translations and the commentary excerpts. Findings: 474 (73 high, 228 medium, 173 low). By field: explanation 313, schools_note 79, background 26, connection 19, essence 15, translation 11, reflection 10, anvaya 1.
5. **Chapter summaries** — read against the verses they cite.

## What changed

- **Sanskrit text: 17 corrections** (list below); counting the speaker lines moved out, 44 verse texts changed.
- **Transliteration: 38 verses corrected.**
- **Translation: 137 verses** — dropped letters restored ("coneror" → "conqueror", "alities" → "qualities"), stray markers removed, six missing translations filled, and 18.45 replaced (the dataset carried 5.10's translation there).
- **Speaker lines:** 28 verses had "श्रीभगवानुवाच" inside the verse text; moved to the speaker field.
- **Teachings:** 383 findings corrected in the text. Fields rewritten: explanation 219, background 28, connection 20, essence 15, reflection 11 verses. The most common problems were claims credited to a named teacher or "the tradition" that the commentaries do not support, and explanations that were two drafts joined together.
- **School notes** (the old free-text "ways of seeing", 79 findings) are replaced everywhere by view cards written from the commentaries themselves.
- **Chapter index:** 27 corrections to names, meanings and summaries.

## What was added

- **Ways of seeing:** 2752 view cards on 699 verses — Mukundananda 685, Śaṅkara 633, Rāmānuja 567, Śrīdhara 443, Abhinavagupta 240, Sivananda 184. Śaṅkara does not comment on 1.1–2.9.
- **Word by word:** 9009 entries; every word of every verse with its meaning, dictionary form, grammar in plain words and compound parts.
- **Hook:** one question per verse that the verse itself answers.
- **Scripture references:** 362 references on 240 verses, 92 of them to Upanishads, as cited in Swami Mukundananda's commentary. Where he cites “the Ramayan” without a number, the quotation is from Tulsīdās's Rāmcaritmānas and is labelled so. His 13 citations of the Bible and the Tao Te Ching were left out.
- **Sources** shown on every verse in the reader.

## Later passes (same month)

- **Background, all 701 verses rewritten.** The background used to be a scene summary shared by a group of verses. Each verse now has its own: who is speaking, what was just said or doubted, and why this verse is spoken. Where Śrīdhara's opening line or Śaṅkara's lead-in gives that reason, it is used and he is named. This replaces the earlier, lighter check of the background field.
- **Thread, all 701 verses checked** against the verse, its neighbours and every verse number cited: 497 passed, 204 were rewritten (wrong or overstated link, a summary instead of a link, a repeat of the background, or unexplained Sanskrit on the card). Before and after for each: [audit-threads.md](audit-threads.md).
- **Limits of these passes.** The reviewers read the commentators' openings in excerpts of about 400 characters, mostly Śrīdhara's Sanskrit, and their readings were not compared with a published translation. Threads were checked only against the translations of the verses they cite.

## Sanskrit corrections

| Verse | Change |
|---|---|
| 1.19 | 'तुमुलोऽभ्यनुनादयन्' -> 'तुमुलो व्यनुनादयन्' |
| 1.20 | ' ।\nहृषीकेशं तदा वाक्यमिदमाह महीपते॥' -> '॥' |
| 1.21 | 'सेनयोरुभयोर्मध्ये' -> 'हृषीकेशं तदा वाक्यमिदमाह महीपते ।\nसेनयोरुभयोर्मध्ये' |
| 2.64 | 'रागद्वेषविमुक्तैस्तु' -> 'रागद्वेषवियुक्तैस्तु' |
| 4.35 | ' (var अशेषाणि)' -> '' |
| 8.7 | ' (orसंशयम्)' -> '' |
| 8.9 | 'मणोरणीयंसमनुस्मरेद्यः' -> 'मणोरणीयांसमनुस्मरेद्यः' |
| 8.12 | 'मूध्न्यार्धायात्मनः' -> 'मूर्ध्न्याधायात्मनः' |
| 8.24 | 'अग्निर्जोतिरहः' -> 'अग्निर्ज्योतिरहः' |
| 11.46 | 'चक्रहस्तं\nइच्छामि' -> 'चक्रहस्त-\nमिच्छामि' |
| 12.2 | 'परयोपेताः ते' -> 'परयोपेतास्ते' |
| 12.6 | 'मत्परः' -> 'मत्पराः' |
| 14.23 | 'इत्येवं योऽवतिष्ठति' -> 'इत्येव योऽवतिष्ठति' |
| 15.3 | 'सुविरूढमूलं\nअसङ्गशस्त्रेण' -> 'सुविरूढमूल-\nमसङ्गशस्त्रेण' |
| 15.17 | 'परमात्मेत्युधाहृतः' -> 'परमात्मेत्युदाहृतः' |
| 16.19 | 'क्रुरान्संसारेषु' -> 'क्रूरान्संसारेषु' |
| 17.11 | 'अफलाङ्क्षिभिर्यज्ञो' -> 'अफलाकाङ्क्षिभिर्यज्ञो' |

## Variant readings and notes kept on verses

| Verse | Note |
|---|---|
| 1.19 | Some editions read tumulo ’bhyanunādayan; Gita Supersite and the critical edition read tumulo vyanunādayan (used here). |
| 1.21 | The half-verse hṛṣīkeśaṃ tadā vākyam… is counted with 1.20 in some editions; placed in 1.21 here, as in Gita Supersite and the critical edition. |
| 2.9 | Variant: parantapaḥ (nominative, describing Arjuna — the reading Sivananda translates) for parantapa (vocative). |
| 2.64 | Variant: rāga-dveṣa-vimuktaiḥ for -viyuktaiḥ; Śaṅkara, Gita Supersite and the critical edition read viyuktaiḥ (used here). |
| 4.33 | The translation of this verse was missing in the source dataset; it is taken from the Sivananda text in the gita/gita dataset. |
| 4.35 | Variant: aśeṣāṇi for aśeṣeṇa. |
| 6.38 | The translation of this verse was missing in the source dataset; it is taken from the Sivananda text in the gita/gita dataset. |
| 8.1 | The translation of this verse was missing in the source dataset; it is taken from the Sivananda text in the gita/gita dataset. |
| 8.7 | Variant: asaṃśayam (Gita Supersite / Gita Press) for asaṃśayaḥ (critical edition, used here). |
| 10.15 | The translation of this verse was missing in the source dataset; it is taken from the Sivananda text in the gita/gita dataset. |
| 12.3 | The translation of this verse was missing in the source dataset; it is taken from the Sivananda text in the gita/gita dataset. |
| 12.18 | The translation of this verse was missing in the source dataset; it is taken from the Sivananda text in the gita/gita dataset. |
| 13.1 | This verse (Arjuna’s question) is absent from the critical edition and from Śaṅkara’s and Rāmānuja’s text; editions that omit it count 700 verses and number the rest of chapter 13 one lower. |
| 14.23 | Variant: ity evaṃ for ity eva. |
| 18.45 | The source dataset carried the translation of 5.10 under this verse; the translation here is the Sivananda text from the gita/gita dataset. |

## Chapter index corrections

- index ch1 transliteration: Arjun Viṣhād Yog -> Arjuna-viṣāda-yoga
- index ch2 transliteration: Sānkhya Yog -> Sāṅkhya-yoga
- index ch3 transliteration: Karm Yog -> Karma-yoga
- index ch4 transliteration: Jñāna Karm Sanyās Yog -> Jñāna-karma-sannyāsa-yoga
- index ch4 meaning: The Yoga of Knowledge and Action -> The Yoga of Knowledge and the Renunciation of Action
- index ch5 transliteration: Karm Sanyās Yog -> Karma-sannyāsa-yoga
- index ch5 meaning: The Yoga of Renunciation -> The Yoga of the Renunciation of Action
- index ch5 teaching: 'is the more honest road' -> 'is the better road'
- index ch6 transliteration: Dhyān Yog -> Dhyāna-yoga
- index ch7 transliteration: Jñāna Vijñāna Yog -> Jñāna-vijñāna-yoga
- index ch7 teaching: 'the one who seeks knowing itself is dearest, for that one seeks nothing in return' -> 'the one who knows, devoted to the One alone, is dearest'
- index ch8 transliteration: Akṣhar Brahma Yog -> Akṣara-brahma-yoga
- index ch9 transliteration: Rāja Vidyā Yog -> Rāja-vidyā-rāja-guhya-yoga
- index ch9 meaning: The Royal Secret -> The Royal Knowledge and the Royal Secret
- index ch10 transliteration: Vibhūti Yog -> Vibhūti-yoga
- index ch10 teaching: 'in the silent the silence' -> 'among secrets the silence'
- index ch11 transliteration: Viśhwarūp Darśhan Yog -> Viśvarūpa-darśana-yoga
- index ch11 teaching: "'I am become Death, destroyer of worlds.'" -> "'I am Time, the destroyer of worlds.'"
- index ch12 transliteration: Bhakti Yog -> Bhakti-yoga
- index ch13 transliteration: Kṣhetra Kṣhetrajña Vibhāg Yog -> Kṣetra-kṣetrajña-vibhāga-yoga
- index ch14 transliteration: Guṇa Traya Vibhāg Yog -> Guṇa-traya-vibhāga-yoga
- index ch15 transliteration: Puruṣhottam Yog -> Puruṣottama-yoga
- index ch16 transliteration: Daivāsura Sampad Vibhāg Yog -> Daivāsura-sampad-vibhāga-yoga
- index ch16 teaching: 'the creed that the world is loveless and false, with desire its only law' -> 'the creed that the world has no truth, no foundation and no Lord, and is born of desire alone'
- index ch17 transliteration: Śhraddhā Traya Vibhāg Yog -> Śraddhā-traya-vibhāga-yoga
- index ch18 transliteration: Mokṣha Sanyās Yog -> Mokṣa-sannyāsa-yoga
- index ch18 meaning: The Yoga of Liberation -> The Yoga of Liberation through Renunciation

## Not verified — read this before relying on it

- **Only the Sanskrit text, transliteration and translation were verified mechanically.** Everything else was judged by reading.
- The reading was done by AI reviewers (Claude), one pass per verse, against commentary excerpts cut at about 2,500 characters. A point made late in a long commentary may have been missed. A sample was spot-checked by hand; not every verse. One verse (18.45) had another verse's commentary filed under it in the dataset; the commentary labels of all verses were then checked by script and no other case was found.
- **Background** texts are shared by groups of verses. Reviewers mostly confirmed them at a glance and corrected 26; they were not read as closely as the explanations.
- **Hooks** were written from the Sanskrit and the translations and checked by script for form only; a sample was read by hand.
- **Grammar** in the word lists was checked against the commentators' glosses, not against a grammar reference or a Sanskrit scholar.
- **Scripture references** carry the chapter and verse numbers exactly as Swami Mukundananda's commentary gives them. They were not looked up in the Upanishads themselves.
- **View cards** are paraphrases of one commentator on one verse. They are not that school's whole position.
- The Sivananda translation in the dataset has not been compared with a printed edition; six verses and 18.45 use the wording of the gita/gita copy, which is lightly modernised.
- Madhva (Dvaita) is not represented: the dataset has his commentary in Sanskrit for few verses.
