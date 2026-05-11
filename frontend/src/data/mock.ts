export const mockUser = {
  name: "Ansh",
  fullName: "Ansh Kumar",
  email: "ansh@gzen.app",
  avatar: "https://images.pexels.com/photos/19178426/pexels-photo-19178426.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  level: 4,
  xp: 850,
  xpForNext: 1200,
  totalPoints: 850,
  streak: 12,
};

export const mockUsageHourly = [
  { hour: "12 AM", value: 5 },
  { hour: "3 AM", value: 2 },
  { hour: "6 AM", value: 8 },
  { hour: "9 AM", value: 32, peak: true },
  { hour: "12 PM", value: 18 },
  { hour: "3 PM", value: 22 },
  { hour: "6 PM", value: 28 },
  { hour: "9 PM", value: 16 },
];

export const mockApps = [
  { id: "instagram", name: "Instagram", feature: "Reels & Explore", icon: "logo-instagram", color: "#E1306C", blocked: true },
  { id: "youtube", name: "YouTube", feature: "Shorts", icon: "logo-youtube", color: "#FF0000", blocked: true },
  { id: "facebook", name: "Facebook", feature: "Reels", icon: "logo-facebook", color: "#1877F2", blocked: false },
  { id: "snapchat", name: "Snapchat", feature: "Stories", icon: "logo-snapchat", color: "#FFFC00", blocked: true },
  { id: "twitter", name: "Twitter", feature: "For you feed", icon: "logo-twitter", color: "#1DA1F2", blocked: false },
  { id: "tiktok", name: "TikTok", feature: "For You", icon: "musical-notes", color: "#FF0050", blocked: true },
];

export const mockGoals = [
  { id: "screen", title: "Reduce Screen Time", desc: "Spend less time on phone", icon: "phone-portrait-outline" },
  { id: "focus", title: "Improve Focus", desc: "Stay focused on important things", icon: "scan-outline" },
  { id: "learn", title: "Learn More", desc: "Use time for learning and growth", icon: "school-outline" },
  { id: "mental", title: "Better Mental Health", desc: "Reduce stress and digital fatigue", icon: "heart-outline" },
];

export const mockBadges = [
  { id: "early", name: "Early Bird", icon: "sunny", color: "#F59E0B", earned: true },
  { id: "focus", name: "Focus Master", icon: "scan", color: "#22C55E", earned: true },
  { id: "task", name: "Task Crusher", icon: "checkmark-done", color: "#3B82F6", earned: true },
  { id: "mindful", name: "Mindful User", icon: "leaf", color: "#A855F7", earned: true },
];

export const mockAchievements = [
  { id: 1, points: 50, title: "Completed 5 tasks today", time: "Today, 8:30 AM" },
  { id: 2, points: 30, title: "Morning focus achieved", time: "Today, 8:30 AM" },
  { id: 3, points: 25, title: "3-day streak unlocked", time: "Yesterday, 9:12 AM" },
];

export const mockArticles = [
  {
    id: 1,
    title: "AI Chips and the Future of Smartphones",
    duration: "3 min read",
    type: "read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: 2,
    title: "How to Build Better Digital Habits",
    duration: "5 min read",
    type: "read",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80",
  },
  {
    id: 3,
    title: "The Science of Deep Focus",
    duration: "4 min listen",
    type: "listen",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&q=80",
  },
  {
    id: 4,
    title: "Mindfulness for Digital Balance",
    duration: "6 min watch",
    type: "watch",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  },
];

export const mockMicroTasks = [
  {
    id: 1,
    prompt: "Summarize this news in one line.",
    context: "AI chips may power the next wave of smartphones, with on-device intelligence becoming a key differentiator.",
    suggestedAnswer: "AI chips will power next generation smartphones.",
  },
  {
    id: 2,
    prompt: "Write one thing you're grateful for today.",
    context: "Reflect on a small win, a person, or a feeling that made today better.",
    suggestedAnswer: "I'm grateful for the morning sunlight.",
  },
  {
    id: 3,
    prompt: "What is your top priority for the next hour?",
    context: "Be specific. Pick one task you can complete in 60 minutes.",
    suggestedAnswer: "Finish the Gzen demo prep.",
  },
];

export const mockTimeDistribution = [
  { label: "Productive", minutes: 80, color: "#22C55E", percent: 48 },
  { label: "Social", minutes: 70, color: "#3B82F6", percent: 27 },
  { label: "Entertainment", minutes: 45, color: "#EF4444", percent: 17 },
  { label: "Others", minutes: 30, color: "#9CA3AF", percent: 8 },
];

export const mockModes = [
  {
    id: "learn",
    name: "Learn Mode",
    desc: "Boost knowledge.\nStay curious.",
    icon: "book",
    bg: "rgba(34, 197, 94, 0.18)",
    border: "rgba(34, 197, 94, 0.4)",
    iconColor: "#22C55E",
  },
  {
    id: "focus",
    name: "Focus Mode",
    desc: "Deep work.\nNo distractions.",
    icon: "scan",
    bg: "rgba(59, 130, 246, 0.18)",
    border: "rgba(59, 130, 246, 0.4)",
    iconColor: "#3B82F6",
  },
  {
    id: "chill",
    name: "Chill Mode",
    desc: "Relax mindfully.\nSet boundaries.",
    icon: "game-controller",
    bg: "rgba(245, 158, 11, 0.18)",
    border: "rgba(245, 158, 11, 0.4)",
    iconColor: "#F59E0B",
  },
];

export const mockSettings = [
  { id: "sensitivity", label: "Intervention Sensitivity", value: "Medium", icon: "options-outline" },
  { id: "screenGoal", label: "Daily Screen Time Goal", value: "3h 30m", icon: "time-outline" },
  { id: "focusStart", label: "Focus Start Time", value: "6:30 AM", icon: "sunny-outline" },
  { id: "focusEnd", label: "Focus End Time", value: "9:30 AM", icon: "moon-outline" },
  { id: "strict", label: "Strictness Level", value: "Soft", icon: "shield-outline" },
  { id: "notif", label: "Notifications", value: "On", icon: "notifications-outline" },
  { id: "privacy", label: "Data & Privacy", value: "", icon: "lock-closed-outline" },
  { id: "help", label: "Help & Support", value: "", icon: "help-circle-outline" },
];
