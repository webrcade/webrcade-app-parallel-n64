const MESSAGES = {
  black: "Screen is black.",
  brunswick: "Playable, but some areas periodically turn black.",
  cAndC: "Menus are extremely slow.",
  colors: "Colors are incorrect.",
  corruptGfx: "Corrupted graphics.",
  dr: "Background not shown. Unable to see thrown pills.",
  duke: "Able to see items through walls.",
  excite: "Freezes at menu.",
  flashingScreen: "Screen continually flashes.",
  gl: "Screen flashing. Locks up when starting level.",
  hex: "Unable to see enemies, black screen.",
  hm: "Graphics corrupted (appear too large).",
  midway: "Game screens are black.",
  locksUp: "Game locks up when starting.",
  noSave: "Unable to save games.",
  periodicFlashing: "Screen periodically flashes.",
  periodicLongPauses: "Game periodically pauses for long periods of time.",
  ppl: "Corrupt graphics, unable to see puzzle blocks.",
  pw: "Playable, some missing graphics.",
  unknownOp: "Game does not start (unknown opcode).",
  xg2: "Graphics corruption. Unable to see course.",
}

const OTHER_VERS = {
  jpn: "Releases for other regions (Japan) appear to work correctly.",
  excite: "Other USA versions and releases for other regions (Europe, Japan) appear to work correctly.",
}

const M = MESSAGES;
const V = OTHER_VERS;
const ISSUES = {
  // Brunswick Circuit Pro Bowling
  "db929d47127ea55bb919f8c7623e0256": [M.brunswick], // USA
  "62e92102d6fd1701a6e904da6ab58ae8": [M.brunswick], // USA
  // Chameleon Twist 2
  "be134500da3342cd5dc7922b5e2697b7": [M.flashingScreen], // USA
  "7a20b97c0b509aaa38e36068acd217c3": [M.flashingScreen], // EUR
  "cb4fc518cb6f3a1d70b3179c23fd54d3": [M.flashingScreen], // JPN
  "45d1d039ab7926adc748de640afd986a": [M.flashingScreen], // EUR
  "740ad4db03952bbe997db09947a41e62": [M.flashingScreen], // JPN
  "00327e0b5df6dce6decc31353f33a3d3": [M.flashingScreen], // USA
  // Command & Conquer
  "d822dde8cafad279c3ea27c22beaefec": [M.cAndC], // USA
  "2b7e4e14d744b40fd393c487e0768c24": [M.cAndC], // EUR
  "fbc337325b9ceae41f237f3e54d72ab3": [M.cAndC], // JPN
  "42da4c7d040f9e7cd046a42ec3e68027": [M.cAndC], // EUR
  "1a9195662c89dcbea88bcfa99b096cde": [M.cAndC], // GER
  "b436f4717ac585b0d847756468fd6393": [M.cAndC], // USA
  // Conker's Bad Fur Day
  "220543f489a9828021ea82a69e6305a3": [M.periodicLongPauses], // USA
  "2b5335b041b161a73c0eba0d76b26ca0": [M.periodicLongPauses], // USA (Beta)
  "e31ded9c7887ebc07a343b8865a2bf55": [M.periodicLongPauses], // EUR
  "05194d49c14e52055df72a54d40791e1": [M.periodicLongPauses], // EUR
  "00e2920665f2329b95797a7eaabc2390": [M.periodicLongPauses], // USA
  "70e9eb9bf2f7bc76ca38ce450ba01c2e": [M.periodicLongPauses], // USA (Beta)
  "5c3d63e73c3a30e4b28d5f79045592d6": [M.periodicLongPauses], // USA (Beta)
  "13ecbaeef7111d5343d73a80e03e353a": [M.periodicLongPauses], // USA (Beta)
  // Duke Nukem 64
  "a18868c5d7bcf919a65999d91653b268": [M.duke], // USA
  "8657cba95c409b74c1f5632cbc36643f": [M.duke], // EUR
  "217d446a4a703533181878920bf95e76": [M.duke], // EUR
  "bb2472b3f8a41fbf3aec3ccef7ea8c78": [M.duke], // EUR (Beta)
  "2ff051d37f1efb8307c91d1e810edaee": [M.duke], // EUR (Beta)
  "e2e79c7167bdb26e176d220904739c91": [M.duke], // FRA
  "521c4e8444786c1ff6cf9bbc6d6facb6": [M.duke], // FRA
  "c7f1a43764a26da2e43f2a36a5f76e4c": [M.duke], // USA
  // Dr. Mario 64
  "1a7936367413e5d6874abda6d623ad32": [M.dr], // USA
  "30ec4f3e1c435ed8b1d1fd3788b6a407": [M.dr], // USA
  // Excitebike 64
  "604f1e6f01aa6cf5215fa7c410f732de": [M.excite, V.excite], // USA (Rev A)
  "21954e4e404d9e87dbdb87dd309f3e94": [M.excite, V.excite], // USA (Rev A)
  // Extreme-G XG2
  "335ce3973ae33c062c92825d8df083d7": [M.xg2], // USA
  "fd1feb895801c0076eee07c4dd07a1b5": [M.xg2], // EUR
  "717be4fe42147c468f0e3f4e1820ef74": [M.xg2], // JPN
  "bb7f98e657fb4b5fcc7dc04bd72e2d2b": [M.xg2], // EUR
  "f17884a2c16fb6fd11a74d65b1388b4a": [M.xg2], // JPN
  "44fe06ba3686c02a7988f27600a533da": [M.xg2], // USA
  // Gauntlet Legends
  "a45b7398e01414ccfe2f66d8f02968d4": [M.gl], // USA
  "fdbb62de0864236733fade8bf18f2ab8": [M.gl], // EUR
  "0b185f16670731a63eac6cf7bffe64aa": [M.gl], // JPN
  "28c2108a375f7731e719333a09439d2f": [M.gl], // EUR
  "3b2615d754a61e45b1034d555d830a78": [M.gl], // JPN
  "9cb963e8b71f18568f78ec1af120362e": [M.gl], // USA
  // Hexen
  "a8531bfd6ffbad2059ef4f34aabc6282": [M.hex], // USA
  "c1d1cdc1d9dd2dcd5643468f91ce0ca6": [M.hex], // EUR
  "b8b66454f3019ba433946a914b7ae4f1": [M.hex], // FRA
  "31d96b7439843350216a12906effc8d5": [M.hex], // GER
  "7648296bed096cce8aa707ade991eda9": [M.hex], // JPN
  "2080262a251d270f9ce819887f2104a7": [M.hex], // EUR
  "a5921c00111200257284ce0aba0904ca": [M.hex], // FRA
  "08cbb141dec604e4dad2787f237d57a2": [M.hex], // GER
  "672152cf4dcb5d0a19662c11eff71452": [M.hex], // JPN
  "eb98f1b8c6898af7417f6882946da9b3": [M.hex], // USA
  // Harvest Moon (Bokujou Monogatari 2 )
  "0a5d1e13b410d209835b43f2a985ef64": [M.hm], // USA
  "6da848a70d83ece130d274124760928e": [M.hm], // USA
  "a6e56e36e311994103a362ca5e5478b9": [M.hm], // JPN
  "82a8c49df8663bb0fca96f6cd16fe0ac": [M.hm], // JPN (Rev 1)
  "e7d9467ed78251c4b393fc9fca348e96": [M.hm], // JPN (Rev 2)
  "1cf31e7f6e0deb2c18c39ddd4eed9e51": [M.hm], // JPN
  "e627b898a7692c08b595a8d2178e34a0": [M.hm], // JPN (Rev 1)
  "24e3ee6a54278db65c463804f2bb6223": [M.hm], // JPN (Rev 2)
  // Iggy's Reckin' Balls
  "07e0d07122336dc0fc83ef1e0bcbeea0": [M.black], // USA
  "08deef2dbcaddc2bcb08b5ecccfd7e48": [M.black], // EUR
  "25b297143e9e5ccbb4b80a7fb6af399b": [M.black], // EUR
  "464211abb602ee1005974d2d835a3bcf": [M.black], // USA
  // In-Fisherman - Bass Hunter 64
  "3451c623e119c62e8a0ac6c3e57bff6f": [M.flashingScreen], // USA
  "7249524a0519489e8173b29246e6dd70": [M.flashingScreen], // EUR
  "bf3e84cdd01cac05987fd8da5191534b": [M.flashingScreen], // EUR
  "c605f40bf669e00a5e51baf0d00621ea": [M.flashingScreen], // USA
  // Indiana Jones and the Infernal Machine
  "2e32be40f6aeaa549579b026989a017f": [M.unknownOp], // USA
  "0af8f08bdbeeb7c7196c3bb1d5b27030": [M.unknownOp], // AUS (Proto)
  "63d7ab29ba3dfc5d5b12c1d9c5832355": [M.unknownOp], // AUS (Proto)
  "70de1eab508596b6bbefd168b5d07194": [M.unknownOp], // USA
  // Jet Force Gemini (Star Twins)
  "0ef01afde32e40228c03904e3d884add": [M.periodicFlashing], // USA
  "d9db99c392e85a82c551cf7808d742ed": [M.periodicFlashing], // USA (Demo)
  "761a047404c6460a077ff858e0244a8f": [M.periodicFlashing], // EUR
  "28bd618b8e7cb56789626b758745467d": [M.periodicFlashing], // JPN
  "baaf237e71aa7526c9b2f01c08b68a53": [M.periodicFlashing], // EUR
  "772cc6eab2620d2d3cdc17bbc26c4f68": [M.periodicFlashing], // USA
  "5bbe9ade7171f2e1daaa7c48fad38728": [M.periodicFlashing], // USA (Demo)
  "ca28a3645fc7ad969ebd75c5d6506e7a": [M.periodicFlashing], // JPN
  // Mario Tennis
  "8dfb2fac888368660b54e390fe9042f4": [M.corruptGfx], // USA
  "c4a2dfc5c9d5041b2d6575db191bf3f3": [M.corruptGfx], // EUR
  "6b7d1db6affbdd27d08c7329c3ce28e2": [M.corruptGfx], // JPN
  "fff9b3e22abb9b60215dafb13ad5a4de": [M.corruptGfx], // EUR
  "759358fad1ed5ae31dcb2001a07f2fe5": [M.corruptGfx], // USA
  "8eb1c2443d0b2e6eda52a4eea66d6c35": [M.corruptGfx], // JPN
  // Mia Hamm Soccer 64
  "537d7cfed7a0f3287d711f187e70b2fc": [M.locksUp], // USA
  "a4039368e0472c68e3072c02c7a80f94": [M.locksUp], // USA
  // Midway's Greatest Arcade Hits - Volume 1
  "68cf12426b11e75df95d64dc6b94d41d": [M.midway], // USA
  "2b86775ea4d848202e4f4a39c33571ca": [M.midway], // USA
  // Mystical Ninja Starring Goemon
  "f2162be647e4aa59254ec5ed7db1e94a": [M.noSave, V.jpn], // USA
  "d9cf1c0538367a4149390c0845363a03": [M.noSave, V.jpn], // EUR
  "698930c7ccd844673d77ffeccb3dd66e": [M.noSave, V.jpn], // EUR
  "643cce1ab06f97e9590241d27e5c2363": [M.noSave, V.jpn], // USA
  // Nascar 99
  "2eab72bf6ee786dd521a360d94a868dd": [M.corruptGfx], // USA
  "15a87a6d01dba1a7c4375ffbc1214bb8": [M.corruptGfx], // EUR
  "96a36a9871b34839d6a2af57c5c4ef96": [M.corruptGfx], // EUR
  "dc5f1a814c8423b4b43f71c229d65a84": [M.corruptGfx], // USA
  // Nascar 2000
  "fb698dd422fab3ce770224b2385173d5": [M.corruptGfx], // USA
  "45feb0fbbec6cb48ff21deae176e9b6b": [M.corruptGfx], // USA
  // NBA Showtime - NBA on NBC
  "9f62363594b50f8a2695c113e52d9485": [M.locksUp], // USA
  "881e98b47f32093c330a8b0dad6bb65d": [M.locksUp], // USA
  // NFL Quarterback Club 98
  "593678bcd8c2c98e0b72cb8b22771584": [M.black], // USA
  "eb1a0007ed08aa3be9ef465447c69caf": [M.black], // EUR
  "a18ca5dbc85668667aa467add6a62b39": [M.black], // EUR
  "709f966c30ce6df1833e95740a5a2ab2": [M.black], // USA
  // Pilotwings 64
  "c5569227242e04138aac8457b7f83e6c": [M.pw], // USA
  "c7bd4ab71093d71d1313905f85292eaf": [M.pw], // JPN
  "9e90e82cda1f83b2bd43b9b19f68e404": [M.pw], // EUR
  "3fcd4969f9a080bd2bcb913ec5d7a3bd": [M.pw], // EUR
  "e8e6ec0692009009f5dca6827b21f59a": [M.pw], // JPN
  "8b346182730ceaffe5e2ccf6d223c5ef": [M.pw], // USA
  // Pokemon Puzzle League
  "afe4cc6f067852b96fec84cb739b4c99": [M.ppl], // USA
  "77a22697ba18ec59018f0c8b5f16c656": [M.ppl], // GER
  "fcc53191ce4825e5b858deaae9ec6d8a": [M.black], // FRA
  "cccda8bdb4c64de28fa086de3f8c0bd1": [M.ppl], // EUR
  "2ef9fa16de2a09ea15b6289447f40490": [M.ppl], // EUR
  "a3ba044dfc00bb766b4b2bfb9d4b5be9": [M.black], // FRA
  "000364bac80e41d9060a31a5923874b7": [M.ppl], // GER
  "e722576a15182cfed6782379ce4bc8be": [M.ppl], // USA
  // Quake
  "056e41dd8205e701f630b8e19ae4f523": [M.flashingScreen], // USA
  "d42ef7adf20697aee783dbc33eafa107": [M.flashingScreen], // EUR
  "592ce7718efdd1ff2f077c9b2b5275fb": [M.flashingScreen], // EUR
  "097605021951024c3ecb2d502c0c2a9f": [M.flashingScreen], // USA
  // Quake II
  "ca711afdd1e85147d309f0c8c56241ad": [M.periodicFlashing], // USA
  "bb759ec808c3ad387b9d7c02b99decce": [M.periodicFlashing], // EUR
  "673d4ba4f41a0fe23650f06af53eec50": [M.periodicFlashing], // EUR
  "cc93c30c633ff461c29b54ceabefd701": [M.periodicFlashing], // USA
  // Resident Evil 2 (Biohazard 2)
  "c03b6654ca31042283010667f5859650": [M.periodicFlashing], // USA
  "2c1c2949b4a5f16ae7c6d9b5db4c034a": [M.periodicFlashing], // USA (Rev 1)
  "13b6f12b9f8cb0cb8c708c3132f7a372": [M.periodicFlashing], // JPN
  "7f3b88a0968fe05034f967f646ebd114": [M.periodicFlashing], // EUR
  "f77d70959222276491222f31ebff3bf1": [M.periodicFlashing], // JPN
  "b04f298721223a22e1150cebc712ee6a": [M.periodicFlashing], // EUR
  "dd21150cbc21c05420304599ec57411c": [M.periodicFlashing], // USA
  "1add2c0217662b307cdfd876b35fbf7a": [M.periodicFlashing], // USA (Rev 1)
  // Star Wars: Rogue Squadron
  "459c6591d816660a2f714d2a9d0dff1e": [M.unknownOp], // USA
  "1822ef9f6da0ddf2b3ccc71f33d4a653": [M.unknownOp], // USA (Rev 1)
  "1488007db476d3eadb42dbabead088b5": [M.unknownOp], // EUR
  "fc21aa1cbf31e5dea71e804878c3b5f0": [M.unknownOp], // EUR (Rev 1)

  "7f919d2e35cbe561e139ae8fe93aca86": [M.unknownOp], // EUR
  "a9dd498e6a28f55311ce4ef057e164b8": [M.unknownOp], // EUR (Rev 1)
  "47cac4e2a6309458342f21a9018ffbf0": [M.unknownOp], // USA
  "2e458d7cc355d7918493b0e0362c9a20": [M.unknownOp], // USA (Rev 1)
  // Star Wars: Shadows of the Empire
  "cb1e1f8d818ab3cadea2cbe24994c9fe": [M.periodicFlashing], // USA
  "944ac4d381a42197f259bd734fbe1095": [M.periodicFlashing], // USA (Beta)
  "547321df653203ad7bcbc178d9c37bf6": [M.periodicFlashing], // USA (Rev 1)
  "99b150a2e655d771ee1695cc1df65b65": [M.periodicFlashing], // USA (Rev 2)
  "5e440149b6beb286aad3a0b1f10ade9e": [M.periodicFlashing], // EUR
  "591cf8e672c9cc0fe9c871cc56dcc854": [M.periodicFlashing], // EUR
  "5cce8ad5f86e8a373a7525dc4c7e6705": [M.periodicFlashing], // USA
  "4076973cfda277fc876e9f066cc73deb": [M.periodicFlashing], // USA (Beta)
  "fa635e837275d28fd5a24d5675ba42c8": [M.periodicFlashing], // USA (Rev 1)
  "c7b40352aad8d863d88d51672f9a0087": [M.periodicFlashing], // USA (Rev 2)
  // Star Wars Episode I: Battle for Naboo
  "abc8665fc1a2c76ff61394aea0dad6c3": [M.unknownOp], // USA
  "415a266c6dff65350fd577a127a2d601": [M.unknownOp], // EUR
  "0bd1f7bb9f4b02520e4e9285c809f099": [M.unknownOp], // EUR
  "3cb88b934572e7520f35e5458798775b": [M.unknownOp], // USA
  // Stunt Racer 64
  "b84f3c943e89f3743befb4092deed5cc": [M.unknownOp], // USA
  "e8b666a429fedb2a1a1228cd450cd4fc": [M.unknownOp], // USA
  // Vigilante 8
  "afce4ff54d26b29ba7be5be1b180fee9": [M.corruptGfx], // USA
  "56fe17c8aebb21a2e625d74f66b7cbe3": [M.corruptGfx], // EUR
  "acf053fbcda123346a446d5133628092": [M.corruptGfx], // FRA
  "5649539d6734f4bc0369ff3ab8c2ca9d": [M.corruptGfx], // GER
  "df011e19f41b1b19c21f1e77e13780b7": [M.corruptGfx], // EUR
  "ff9f85c50982dbdba9853a8915321d31": [M.corruptGfx], // FRA
  "37b430ee16167831c6c6292994f93277": [M.corruptGfx], // GER
  "d616adf6441acbbd0e6bef023a8f6031": [M.corruptGfx], // USA
  // Vigilante 8: 2nd Offense
  "f2c52f565bd370e6827ae8c6438e5a51": [M.corruptGfx], // USA
  "417701c8ee152e3e9003001623ebae5b": [M.corruptGfx], // EUR
  "47661ef1964524b6319b759913f08b62": [M.corruptGfx], // EUR
  "60cdf7445fad2aba05c958f46691501b": [M.corruptGfx], // USA
  // Waialae Country Club - True Golf Classics
  "ac8e0ba90cf88f77382ac450e3975343": [M.colors], // USA
  "8f0fd604b64dfdf18e3922258ede4dd1": [M.colors], // USA (Rev 1)
  "a3f14021f514509f6a001073f0f7ed19": [M.colors], // EUR
  "7ea7f5676d06d1c6387e7b8c01905bc3": [M.colors], // EUR (Rev 1)
  "5f1906df4eb30537c2ac2fcbd005907d": [M.colors], // EUR
  "f7c1b1ee1ce37ce09aa48c7e0a115efa": [M.colors], // EUR (Rev 1)
  "dd8154d507c88694afd69c7af16a8cd6": [M.colors], // USA
  "67f75c4dd30922a001c8c32aeb9333ac": [M.colors], // USA) (Rev 1)
}

const getCompatibilityMessage = (md5) => {
  const msgs = ISSUES[md5];
  if (msgs) {
    let retMsg = "This game has known compatibility issues.";
    let first = true;
    msgs.forEach((msg) => {
      retMsg += "\n" + (first ? ("\"" + msg + "\"") : msg);
      first = false;
    });
    return retMsg;
  }
  return null;
};

export { getCompatibilityMessage }
