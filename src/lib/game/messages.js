import { MAX_LEVEL, getVersion } from "./config.js";

const KARI_MESSAGES = [
  "Okay Kari... not bad 😂",
  "See? I knew you had it in you 😌",
  "Don't get too proud, it was only one level 👀",
  "Go drink some water before I start lecturing you 😂",
  "Okayyy miss genius, calm down 😭",
  "I'm not saying you're cute when you're focused... but 👀",
  "One level down. Still stuck with Sam unfortunately.",
  "You actually did that pretty fast... suspicious 🤨",
  "Remember to take care of yourself too, okay? 🌸",
  "I could've made this easier. But annoying you is half the fun 😂",
  "Imagine losing to emojis... embarrassing. Good thing you're not me 😭",
  "Not gonna lie, I'm kinda enjoying watching you play this 😌",
  "Okay fine, that was impressive.",
  "You better not skip the message just because you wanna see the next level 😂",
  "Tiny reminder: eat something if you haven't already.",
  "You're getting dangerously good at this 👀",
  "I hope something made you smile today. If not, this message will have to do 😂",
  "I made this game just so I could keep bothering you.",
  "Don't let this game distract you from sleeping properly, nerd 🌙",
  "Another win... Sam is pretending to be surprised.",
  "If I give you a hint, I deserve credit for the win too. Fair? 😌",
  "You're cute. Anyway... next level 😂",
  "I was gonna say something sweet but then I remembered you're annoying.",
  "Okay, I'm actually proud of you. Don't make me repeat it.",
  "You're really committed to beating all 100 huh 😭",
  "Drink water. Yes, I'm still doing my annoying Sam duties.",
  "This level was supposed to humble you 😂",
  "Apparently you're smarter than I gave you credit for.",
  "I wonder if you're reading every single one of these 👀",
  "Don't answer that. I already know you are 😂",
  "At this point I'm just making excuses to talk to you.",
  "One more level... because clearly I wasn't done annoying you.",
  "You know what's unfair? You somehow make this look easy.",
  "If I were there, I'd probably distract you instead of helping 😌",
  "Okay okay... you're pretty good at this.",
  "Your reward is another message from me. You're welcome.",
  "Please don't let this game inflate your ego 😂",
  "I hope you're having a good day, Kari. 🌸",
  "Another one down. Come here, I'll give you an imaginary high five ✋",
  "I'm starting to think your stubbornness is carrying you through this.",
  "You really chose to spend your time finding tiny emojis for me 😭",
  "That's actually kinda cute.",
  "No cheating. I know where you live... spiritually 👀😂",
  "You're allowed to take a break, you know.",
  "Okay, that was smooth. I'll give you that.",
  "I made 100 levels because apparently one excuse to bother you wasn't enough.",
  "Don't stay up too late trying to finish this 😌",
  "You're doing better than you think.",
  "If you lose now, I'll laugh. If you win, I'll still laugh. Perfect system 😂",
  "Halfway there... and I'm still not tired of talking to you.",
  "Okay fine... maybe I like making little things for you.",
  "Don't expose me though 😭",
  "You know I actually put way too much thought into this, right?",
  "Another level unlocked. Another excuse to tell you you're cute 👀",
  "I'm beginning to regret making this game this long 😂",
  "No I'm not. I like having you here.",
  "Go stretch a little. Your screen isn't going anywhere.",
  "You survived another one. Proud of you, idiot 😌",
  "I hope you're taking care of yourself while you're busy with everything else.",
  "You're becoming way too good at my own game.",
  "At this point you're basically speedrunning my affection 😂",
  "Okay that was smooth... almost as smooth as me. Almost.",
  "I feel like you secretly enjoy getting these messages.",
  "Another win for you. My ego is taking damage 😭",
  "I could've just sent you a normal message, but apparently I had to build an entire game 😂",
  "You're one of my favorite people to annoy. Just so we're clear.",
  "Don't smile too much. I might start thinking I'm funny.",
  "You know I really like seeing you happy, right?",
  "Tiny reminder that you're appreciated. That's all. 🌸",
  "Okay enough sweetness. Go beat the next level 😂",
  "I wonder what you're gonna say when you realize how many messages I wrote for you.",
  "You're still here. I'm still here. This is getting suspicious 👀",
  "If this game takes you 3 hours, I'm blaming your memory 😂",
  "You're cute when you're competitive. It's a problem.",
  "I hope you know there's a lot of care hiding behind all my teasing.",
  "Another one done. I'm genuinely happy you're enjoying this.",
  "Don't make me say something embarrassingly sweet 😭",
  "Fine... I'm glad you're here.",
  "You really are special to me, you know.",
  "Okay that's enough feelings for one level. Back to bullying you 😂",
  "Only a few more... don't disappear now 👀",
  "You're actually going to finish all 100, aren't you?",
  "I made this for you and somehow you're the one making me nervous now 😂",
  "Three more after this... behave yourself.",
  "You're getting dangerously close to the final message.",
  "I hope you've been smiling at at least some of these.",
  "One more little level. You've got this 🌸",
  "Okay Kari... I'm officially impressed.",
  "Last one after this. Don't make me emotional 😭",
  "Haha... you actually finished it 😂💗",
  "I hope you know I really did make every little part of this thinking about you.",
  "And yes, I'd probably do something this stupid for you again 😂",
  "You made it all the way here... I'm genuinely happy you did.",
  "Okay, final level. Come on, pretty girl 😌",
  "You better appreciate how much work went into this, because I'm never admitting how long it took 😂",
  "I think my favorite part was knowing you'd eventually find all these messages.",
  "Thanks for playing along with my stupid little idea. 🌸",
  "You survived 100 levels of me. Honestly, that deserves a medal 😂",
  "And somehow, after all that... I'd still choose you to annoy.",
  "Haha... you finally finished it 😭💗 I'm really glad you played it all the way through. I made this whole ridiculous thing just for you, and honestly? I'd do it again."
];

const MILESTONES = {
  "100": "100 levels. That's the original road completed 🌸",
  "500": "500 levels?! Kari, you're actually serious about this 😂",
  "1000": "ONE THOUSAND LEVELS 😭",
  "1500": "1,500 levels. Who gave you this much patience?",
  "2000": "2,000 levels completed. That's actually insane.",
  "2500": "Halfway through 5,000. Don't stop now 👀",
  "3000": "3,000 levels. Kari has officially become the memory boss.",
  "3500": "3,500. At this point Sam is impressed and slightly concerned 😂",
  "4000": "4,000 levels. You're still here. Respect.",
  "4500": "4,500. The final chapter begins now 💗",
  "5000": "5,000 LEVELS. You actually did it. 😭💗"
};

const VERSION_NAMES = { 2: "Secret Garden", 3: "Shuffle Road", 4: "Chaos Carnival", 5: "Time Rift", 6: "Mirror Maze", 7: "Phantom Woods", 8: "Storm Highway", 9: "Nightmare District", 10: "Boss Road", 11: "Final Dream" };

const SWEET_TEMPLATES = [
  "You're doing amazing, Kari. I see how hard you're trying 🌸",
  "Another level down. I'm still cheering for you, always.",
  "You make this look easy. I know it isn't.",
  "I'm proud of you. Not just for the game, but for everything.",
  "You're my favorite person to watch succeed.",
  "The way you focus is actually really cute.",
  "I hope you know how much I believe in you.",
  "Every level you beat, I like you a little more. That's not a joke.",
  "You're stronger than you think. Even when the board is chaos.",
  "Thank you for playing this silly game. It means a lot.",
  "You're the best part of my day, Kari.",
  "No matter how many levels you pass, I'll always be here to annoy you. But also to support you.",
  "You're doing better than you give yourself credit for.",
  "I love watching you win. Keep going.",
  "Your smile could power this whole game. Just saying."
];

const TEASING_TEMPLATES = [
  "You're getting too good at this. It's suspicious 👀",
  "Did you just beat that level? I'm not impressed... okay maybe a little.",
  "Careful, your ego is showing 😂",
  "Another win? I'm starting to think you're cheating with your cuteness.",
  "You're so stubborn, you'd probably beat this game out of spite.",
  "I made this level specifically to annoy you. It didn't work.",
  "You're not allowed to be this good AND this cute. Pick one.",
  "I swear you're just guessing and getting lucky.",
  "You know I can't stay mad when you win. It's annoying.",
  "If you keep winning, I'll have to make level 5000 literally impossible.",
  "You think you're so smart. You are, but still.",
  "I'm not saying I let you win... but I'm also not not saying that.",
  "Your victory dance is probably adorable. I can't see it, but I know.",
  "You beat that level way too fast. Were you even trying to enjoy my messages?",
  "You're making me regret adding hints. Not really, but still."
];

const CUTE_TEMPLATES = [
  "You're cute when you're focused. I've said it before, I'll say it again.",
  "Every level you pass, I fall for you a little more. It's a problem.",
  "I made this game just so I'd have an excuse to talk to you. It worked.",
  "You have no idea how much I enjoy watching you play.",
  "If I were there, I'd probably be too distracted by you to help with the level.",
  "Your little victory messages are the highlight of my day.",
  "I could watch you play this for hours. Actually, I already do.",
  "You're dangerously cute and dangerously good at this. Deadly combo.",
  "I think about you more than I think about this game. And I made it.",
  "You're my favorite notification.",
  "I hope you're smiling right now, because that's all I want.",
  "You're the reason I keep adding levels. I just want more excuses to message you.",
  "If you were an emoji, you'd be the one I can't find because I'm too busy looking at you.",
  "I'm not saying you're perfect, but you're pretty close.",
  "You make my heart do that weird thing. You know the one."
];

const FUNNY_TEMPLATES = [
  "Did you know that 90% of players quit right before they win? You're the 10%.",
  "I'm legally required to tell you that you're doing great. Also illegally.",
  "I put a 'secret message' in every level. It's just me being annoying.",
  "You found the hidden emoji, and now you've found this hidden message. Surprise!",
  "I asked a genie for a brilliant player. I got you. Genie had good taste.",
  "This level was brought to you by my undying need to bother you.",
  "You're doing so well that I'm starting to question my own game's difficulty.",
  "If you beat level 5000, I'll give you a prize. The prize is more of my messages.",
  "I spent 10 minutes writing this message. Worth it.",
  "You're like a human cheat code. But cuter.",
  "I'm running out of ways to say 'you're good at this' without inflating your ego. Help.",
  "This level was sponsored by 'Sam being annoying'. No refunds.",
  "You've unlocked the secret achievement: 'Putting up with Sam'.",
  "I'd give you a gold star, but I'm all out. Here's a virtual cookie 🍪",
  "You're so good at this game that I'm starting to think you have a superpower. The superpower is being you."
];

const SHORT_TEMPLATES = [
  "Good job. Next.",
  "Boom. Done. You're welcome.",
  "Nice work, nerd 😌",
  "You did it. Shocking.",
  "Another one bites the dust.",
  "Easy peasy for you, huh?",
  "Don't get used to it.",
  "You're on a roll.",
  "Level up! ...Oh wait, that's you.",
  "Flawless. Almost suspicious.",
  "Keep going, I'm watching (in a supportive way).",
  "You're doing the thing!",
  "Nice. Now do it again.",
  "You make this look fun.",
  "I'd high‑five you if I could. ✋"
];

const LONG_TEMPLATES = [
  "You know, when I made this game, I never expected you to actually get this far. I should've known you'd be too stubborn to stop. I'm not complaining, though. I like having you here.",
  "Every level you pass is like a little reminder that you can do anything you set your mind to. Even when the board is messy and the cards keep moving, you find a way. It's honestly inspiring, Kari.",
  "I've written so many messages for you that I've lost count. But each one is a tiny note from me to you, saying 'I'm still here, and I'm still proud of you.'",
  "Some days are hard, I know. But you're still here, still playing, still winning. That says more about you than any game score ever could.",
  "You've been through a lot of levels by now. Each one a little challenge, a little test. And you've passed every single one. You're not just good at this game—you're good at life, too.",
  "I think part of the reason I made this game was to prove to myself that I could make something you'd enjoy. Seeing you play it, seeing you succeed... that's better than I imagined.",
  "There's a kind of magic in watching you focus. It's like the whole world disappears except you and the board. I could watch that forever.",
  "You don't have to be perfect, Kari. You just have to keep going. And that's exactly what you're doing. I admire that.",
  "I hope you're taking care of yourself between levels. You deserve rest, too. But I'm also happy you're here.",
  "This is one of those moments where I wish I could be there in person, just to see your face when you beat another level. Maybe one day.",
  "You've unlocked so many messages now. I hope they make you feel a little less alone, a little more appreciated. Because you are.",
  "The game would be nothing without you playing it. You bring it to life."
];

const VERSION_SPECIFIC = {
  2: [
    "Secret Garden is treating you well, I see. 🌷",
    "In the garden, even the flowers are impressed by you.",
  ],
  3: [
    "Shuffle Road is no match for your memory.",
    "The road may shift, but your focus doesn't.",
  ],
  4: [
    "Chaos Carnival is chaotic, but you're calmer than a carousel.",
    "Traps and bombs? You handle them like it's a walk in the park.",
  ],
  5: [
    "Time Rift is ticking, and you're still ahead of the clock.",
    "Every second counts, and you're using them perfectly.",
  ],
  6: [
    "Mirror Maze can't confuse someone as sharp as you.",
    "You're navigating the maze like you built it yourself.",
  ],
  7: [
    "Phantom Woods is spooky, but you're fearless.",
    "The ghosts are probably more scared of you than you are of them.",
  ],
  8: [
    "Storm Highway is rough, but you're riding it like a pro.",
    "Blackouts and storms? You've got this.",
  ],
  9: [
    "Nightmare District is dark, but you're the light.",
    "One mistake can cost everything, but you don't make mistakes.",
  ],
  10: [
    "Boss Road is where legends are made. You're a legend.",
    "Boss levels only make you stronger.",
  ],
  11: [
    "Final Dream: this is where it all ends. You're almost there.",
    "The final road is long, but you've come so far.",
  ],
};

const ADJECTIVES = [
  "amazing",
  "brilliant",
  "stubborn",
  "cute",
  "ridiculous",
  "unstoppable",
  "focused",
  "sneaky",
  "adorable",
  "impressive",
  "chaotic",
  "determined",
  "fearless",
  "smooth",
  "silly",
  "perfect",
  "relentless",
  "charming",
  "clever",
  "dramatic",
  "elegant",
  "fierce",
  "gentle",
  "heroic",
  "incredible",
  "joyful",
  "kind",
  "legendary",
  "mysterious",
  "noble",
  "optimistic",
  "passionate",
  "quick",
  "radiant",
  "sharp",
  "thoughtful",
  "unique",
  "vibrant",
  "witty",
  "zealous"
];

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function pickFromArray(arr, level) {
  return arr[Math.floor(seededRandom(level) * arr.length)];
}
export function getLevelMessage(level) {
  if (MILESTONES[level]) return MILESTONES[level];
  if (level <= KARI_MESSAGES.length) return KARI_MESSAGES[level - 1];
  const version = getVersion(level);
  const versionId = version.id;
  const versionName = VERSION_NAMES[versionId] || version.name;
  const mod10 = level % 10;
  const mod25 = level % 25;
  let template;
  if (mod10 === 0) template = pickFromArray(CUTE_TEMPLATES, level);
  else if (mod25 === 0) template = pickFromArray(LONG_TEMPLATES, level);
  else if (level % 5 === 0) template = pickFromArray(FUNNY_TEMPLATES, level);
  else if (level % 7 === 0) template = pickFromArray(SHORT_TEMPLATES, level);
  else if (level % 3 === 0) template = pickFromArray(TEASING_TEMPLATES, level);
  else template = pickFromArray(SWEET_TEMPLATES, level);
  if (seededRandom(level + 999) < 0.05 && VERSION_SPECIFIC[versionId]) {
    template = pickFromArray(VERSION_SPECIFIC[versionId], level);
  }
  const adj = pickFromArray(ADJECTIVES, level + 12345);
  let msg = template
    .replaceAll("{level}", level)
    .replaceAll("{version}", versionName)
    .replaceAll("{adj}", adj);
  if (level % 100 === 99) {
    msg += " (Also, you're almost at the next century of levels. 👀)";
  }
  return msg;
}
export function getFinalMessage() {
  return MILESTONES[MAX_LEVEL];
}
export function getLevelNote(level) {
  return getLevelMessage(level);
}
export function getDailyNote() {
  return "Today's bloom is only here until midnight. You found it.";
}
export const IRIS_FALLBACK = [
  "I am here. We can talk, or we can just sit with the garden.",
  "If the board feels loud, close your eyes for one breath. Then look again at the edges.",
  "You do not need a perfect run. You need a kind one.",
  "Hints are not cheating. They are the garden leaning in.",
  "When two cards feel familiar, trust the first feeling. Second-guessing is the storm.",
  "I made tea, metaphorically. Stay as long as you want.",
  "Tired is not a failure state. It is a weather report.",
  "The next pair is usually near where you last looked, not where you fear it is.",
];
function pick(list, seed) {
  return list[Math.floor(seededRandom(seed) * list.length)];
}
export function irisFallback(seed) {
  return pick(IRIS_FALLBACK, seed + 99);
}
export const HOW_TO = [
  { title: "Look, then choose", body: "Each stop begins with a brief look at every card. Remember the feeling of pairs, not every position." },
  { title: "Two at a time", body: "Turn two cards. A match stays open. A miss turns back. There is no punishment for taking a second." },
  { title: "Garden gifts", body: "Bloom pairs score more. Dew adds time. Storm steals a little time. Thorns are unpaired — leave them be." },
  { title: "Calm path", body: "In settings, Calm Path turns off fail states. The garden will wait. This is the intended way to play if you want rest." },
];
