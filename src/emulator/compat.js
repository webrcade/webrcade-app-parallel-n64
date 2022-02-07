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
  // Chameleon Twist 2
  "be134500da3342cd5dc7922b5e2697b7": [M.flashingScreen], // USA
  "7a20b97c0b509aaa38e36068acd217c3": [M.flashingScreen], // EUR
  "cb4fc518cb6f3a1d70b3179c23fd54d3": [M.flashingScreen], // JPN
  // Command & Conquer 
  "d822dde8cafad279c3ea27c22beaefec": [M.cAndC], // USA  
  "2b7e4e14d744b40fd393c487e0768c24": [M.cAndC], // EUR  
  "fbc337325b9ceae41f237f3e54d72ab3": [M.cAndC], // JPN  
  // Conker's Bad Fur Day
  "220543f489a9828021ea82a69e6305a3": [M.periodicLongPauses], // USA  
  "2b5335b041b161a73c0eba0d76b26ca0": [M.periodicLongPauses], // USA (Beta)  
  "e31ded9c7887ebc07a343b8865a2bf55": [M.periodicLongPauses], // EUR  
  // Duke Nukem 64
  "a18868c5d7bcf919a65999d91653b268": [M.duke], // USA
  // Dr. Mario 64 
  "30ec4f3e1c435ed8b1d1fd3788b6a407": [M.dr], // USA
  // Excitebike 64
  "604f1e6f01aa6cf5215fa7c410f732de": [M.excite, V.excite], // USA (Rev A)
  // Extreme-G XG2
  "335ce3973ae33c062c92825d8df083d7": [M.xg2], // USA    
  "fd1feb895801c0076eee07c4dd07a1b5": [M.xg2], // EUR    
  "717be4fe42147c468f0e3f4e1820ef74": [M.xg2], // JPN    
  // Gauntlet Legends
  "a45b7398e01414ccfe2f66d8f02968d4": [M.gl], // USA
  "fdbb62de0864236733fade8bf18f2ab8": [M.gl], // EUR  
  "0b185f16670731a63eac6cf7bffe64aa": [M.gl], // JPN    
  // Hexen
  "a8531bfd6ffbad2059ef4f34aabc6282": [M.hex], // USA
  "c1d1cdc1d9dd2dcd5643468f91ce0ca6": [M.hex], // EUR
  "b8b66454f3019ba433946a914b7ae4f1": [M.hex], // FRA
  "31d96b7439843350216a12906effc8d5": [M.hex], // GER
  "7648296bed096cce8aa707ade991eda9": [M.hex], // JPN
  // Harvest Moon (Bokujou Monogatari 2 )
  "0a5d1e13b410d209835b43f2a985ef64": [M.hm], // USA
  "a6e56e36e311994103a362ca5e5478b9": [M.hm], // JPN
  "82a8c49df8663bb0fca96f6cd16fe0ac": [M.hm], // JPN (Rev 1)
  "e7d9467ed78251c4b393fc9fca348e96": [M.hm], // JPN (Rev 2)
  // In-Fisherman - Bass Hunter 64
  "3451c623e119c62e8a0ac6c3e57bff6f": [M.flashingScreen], // USA
  "7249524a0519489e8173b29246e6dd70": [M.flashingScreen], // EUR
  // Indiana Jones and the Infernal Machine
  "2e32be40f6aeaa549579b026989a017f": [M.unknownOp], // USA
  "0af8f08bdbeeb7c7196c3bb1d5b27030": [M.unknownOp], // AUS (Proto)  
  // Jet Force Gemini (Star Twins)
  "0ef01afde32e40228c03904e3d884add": [M.periodicFlashing], // USA      
  "d9db99c392e85a82c551cf7808d742ed": [M.periodicFlashing], // USA (Demo)
  "761a047404c6460a077ff858e0244a8f": [M.periodicFlashing], // EUR
  "28bd618b8e7cb56789626b758745467d": [M.periodicFlashing], // JPN
  // Mario Tennis
  "8dfb2fac888368660b54e390fe9042f4": [M.corruptGfx], // USA    
  "c4a2dfc5c9d5041b2d6575db191bf3f3": [M.corruptGfx], // EUR    
  "6b7d1db6affbdd27d08c7329c3ce28e2": [M.corruptGfx], // JPN    
  // Midway's Greatest Arcade Hits - Volume 1
  "68cf12426b11e75df95d64dc6b94d41d": [M.midway], // USA    
  // Mystical Ninja Starring Goemon
  "f2162be647e4aa59254ec5ed7db1e94a": [M.noSave, V.jpn], // USA
  "d9cf1c0538367a4149390c0845363a03": [M.noSave, V.jpn], // EUR
  // Nascar 99  
  "2eab72bf6ee786dd521a360d94a868dd": [M.corruptGfx], // USA
  // Nascar 2000
  "fb698dd422fab3ce770224b2385173d5": [M.corruptGfx], // USA
  // NFL Quarterback Club 98
  "593678bcd8c2c98e0b72cb8b22771584": [M.black], // USA
  "eb1a0007ed08aa3be9ef465447c69caf": [M.black], // EUR
  // Pilotwings 64
  "c5569227242e04138aac8457b7f83e6c": [M.pw], // USA
  "c7bd4ab71093d71d1313905f85292eaf": [M.pw], // JPN
  "9e90e82cda1f83b2bd43b9b19f68e404": [M.pw], // EUR
  // Pokemon Puzzle League
  "afe4cc6f067852b96fec84cb739b4c99": [M.ppl], // USA
  "77a22697ba18ec59018f0c8b5f16c656": [M.ppl], // GER
  "fcc53191ce4825e5b858deaae9ec6d8a": [M.black], // FRA
  "cccda8bdb4c64de28fa086de3f8c0bd1": [M.ppl], // EUR
  // Quake II
  "ca711afdd1e85147d309f0c8c56241ad": [M.periodicFlashing], // USA
  "bb759ec808c3ad387b9d7c02b99decce": [M.periodicFlashing], // EUR  
  // Resident Evil 2 (Biohazard 2)
  "c03b6654ca31042283010667f5859650": [M.periodicFlashing], // USA
  "2c1c2949b4a5f16ae7c6d9b5db4c034a": [M.periodicFlashing], // USA (Rev 1)
  "13b6f12b9f8cb0cb8c708c3132f7a372": [M.periodicFlashing], // JPN
  "7f3b88a0968fe05034f967f646ebd114": [M.periodicFlashing], // EUR
  // Star Wars: Rogue Squadron
  "459c6591d816660a2f714d2a9d0dff1e": [M.unknownOp], // USA  
  "1822ef9f6da0ddf2b3ccc71f33d4a653": [M.unknownOp], // USA (Rev 1)  
  "1488007db476d3eadb42dbabead088b5": [M.unknownOp], // EUR
  "fc21aa1cbf31e5dea71e804878c3b5f0": [M.unknownOp], // EUR (Rev 1)
  // Star Wars: Shadows of the Empire
  "cb1e1f8d818ab3cadea2cbe24994c9fe": [M.periodicFlashing], // USA
  "944ac4d381a42197f259bd734fbe1095": [M.periodicFlashing], // USA (Beta)
  "547321df653203ad7bcbc178d9c37bf6": [M.periodicFlashing], // USA (Rev 1)  
  "99b150a2e655d771ee1695cc1df65b65": [M.periodicFlashing], // USA (Rev 2)    
  "5e440149b6beb286aad3a0b1f10ade9e": [M.periodicFlashing], // EUR  
  // Star Wars Episode I: Battle for Naboo
  "abc8665fc1a2c76ff61394aea0dad6c3": [M.unknownOp], // USA
  "415a266c6dff65350fd577a127a2d601": [M.unknownOp], // EUR
  // Vigilante 8  
  "afce4ff54d26b29ba7be5be1b180fee9": [M.corruptGfx], // USA
  "56fe17c8aebb21a2e625d74f66b7cbe3": [M.corruptGfx], // EUR
  "acf053fbcda123346a446d5133628092": [M.corruptGfx], // FRA
  "5649539d6734f4bc0369ff3ab8c2ca9d": [M.corruptGfx], // GER  
  // Vigilante 8: 2nd Offense
  "f2c52f565bd370e6827ae8c6438e5a51": [M.corruptGfx], // USA
  "417701c8ee152e3e9003001623ebae5b": [M.corruptGfx], // EUR
  // Waialae Country Club - True Golf Classics
  "ac8e0ba90cf88f77382ac450e3975343": [M.colors], // USA
  "8f0fd604b64dfdf18e3922258ede4dd1": [M.colors], // USA (Rev 1)
  "a3f14021f514509f6a001073f0f7ed19": [M.colors], // EUR
  "7ea7f5676d06d1c6387e7b8c01905bc3": [M.colors], // EUR (Rev 1)
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
