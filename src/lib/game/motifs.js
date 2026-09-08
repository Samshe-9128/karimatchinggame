import { Apple, Bird, Cat, Cherry, CloudMoon, Clover, Droplets, Feather, Fish, Flame, Flower2, Grape, Heart, Leaf, Moon, MoonStar, Palmtree, Rabbit, Rainbow, Shell, Snowflake, Sprout, Star, Sun, Trees, Turtle, Waves, Wheat, Wind } from "lucide-react";

export const MOTIFS = [
  { id: "flower", name: "Peony", emoji: "🌸", Icon: Flower2 },
  { id: "leaf", name: "Leaf", emoji: "🐼", Icon: Leaf },
  { id: "sprout", name: "Sprout", emoji: "💗", Icon: Sprout },
  { id: "clover", name: "Clover", emoji: "🌙", Icon: Clover },
  { id: "cherry", name: "Cherry", emoji: "✨", Icon: Cherry },
  { id: "grape", name: "Grape", emoji: "🦋", Icon: Grape },
  { id: "apple", name: "Apple", emoji: "🌷", Icon: Apple },
  { id: "wheat", name: "Wheat", emoji: "🍓", Icon: Wheat },
  { id: "trees", name: "Grove", emoji: "🍒", Icon: Trees },
  { id: "palm", name: "Palm", emoji: "🧸", Icon: Palmtree },
  { id: "heart", name: "Heart", emoji: "🎀", Icon: Heart },
  { id: "moon", name: "Moon", emoji: "🌻", Icon: Moon },
  { id: "moonstar", name: "Night", emoji: "🍩", Icon: MoonStar },
  { id: "cloudmoon", name: "Dusk", emoji: "🎮", Icon: CloudMoon },
  { id: "star", name: "Star", emoji: "🎧", Icon: Star },
  { id: "sun", name: "Sun", emoji: "⭐", Icon: Sun },
  { id: "cloud", name: "Cloud", emoji: "🍉", Icon: CloudMoon },
  { id: "rainbow", name: "Arc", emoji: "🦊", Icon: Rainbow },
  { id: "wind", name: "Wind", emoji: "🐰", Icon: Wind },
  { id: "waves", name: "Tide", emoji: "🐱", Icon: Waves },
  { id: "droplets", name: "Dew", emoji: "☁️", Icon: Droplets },
  { id: "snow", name: "Frost", emoji: "🍀", Icon: Snowflake },
  { id: "flame", name: "Ember", emoji: "🌈", Icon: Flame },
  { id: "feather", name: "Feather", emoji: "💫", Icon: Feather },
  { id: "bird", name: "Bird", emoji: "🫶", Icon: Bird },
  { id: "cat", name: "Cat", emoji: "🌺", Icon: Cat },
  { id: "fish", name: "Fish", emoji: "🍰", Icon: Fish },
  { id: "rabbit", name: "Hare", emoji: "🪻", Icon: Rabbit },
  { id: "turtle", name: "Turtle", emoji: "🕊️", Icon: Turtle },
  { id: "shell", name: "Shell", emoji: "🥨", Icon: Shell },
];

export function motifById(id) {
  return MOTIFS.find((m) => m.id === id) ?? MOTIFS[0];
}
