import {
  TrophyAnimation,
  SnorlaxAnimation,
  BearAnimation,
  IndolentAnimation,
  LazyPandaAnimation,
} from "@/components/animations";
import { TenorGifGrid } from "@/components/tenor-gifs";

const characters = [
  {
    Animation: LazyPandaAnimation,
    name: "Lazy Panda",
    vibe: "same energy as vrinda taking meds",
    size: 180,
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    shadow: "0 6px 0 #bbf7d0",
    tag: "relatable",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    Animation: SnorlaxAnimation,
    name: "Dreaming Snorlax",
    vibe: "vrinda before taking meds",
    size: 180,
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    shadow: "0 6px 0 #bfdbfe",
    tag: "mood",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    Animation: BearAnimation,
    name: "Sleeping Polar Bear",
    vibe: "what vrinda does instead of meds",
    size: 180,
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    shadow: "0 6px 0 #ddd6fe",
    tag: "icon",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    Animation: IndolentAnimation,
    name: "Indolent Evening",
    vibe: "vrinda every evening tbh",
    size: 180,
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    shadow: "0 6px 0 #fed7aa",
    tag: "accurate",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    Animation: TrophyAnimation,
    name: "Trophy",
    vibe: "when she actually takes all meds",
    size: 180,
    bg: "from-yellow-50 to-amber-50",
    border: "border-yellow-200",
    shadow: "0 6px 0 #fde68a",
    tag: "rare",
    tagColor: "bg-yellow-100 text-yellow-700",
  },
];

export default function FunPage() {
  return (
    <div className="max-w-md mx-auto px-4 pt-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-display font-semibold text-[#1e1040]">
          Fun Corner
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: "#a78bfa" }}>
          just vibes, no responsibilities
        </p>
      </div>

      {/* Quote banner */}
      <div
        className="card mb-5 px-4 py-3 text-sm font-semibold"
        style={{
          background: "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)",
          color: "#7C5CFF",
          fontStyle: "italic",
        }}
      >
        these guys understand vrinda better than anyone
      </div>

      {/* Character grid */}
      <div className="flex flex-col gap-4">
        {characters.map(({ Animation, name, vibe, size, bg, border, shadow, tag, tagColor }) => (
          <div
            key={name}
            className={`card bg-gradient-to-br ${bg} border-2 ${border} overflow-hidden`}
            style={{ boxShadow: shadow }}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Animation */}
              <div className="flex-shrink-0 flex items-center justify-center w-[120px] h-[120px]">
                <Animation size={size} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-display font-semibold text-lg text-[#1e1040] leading-tight">
                    {name}
                  </h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColor}`}>
                    {tag}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500 italic leading-relaxed">
                  &ldquo;{vibe}&rdquo;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GIF section */}
      <div className="mt-6">
        <div className="mb-3">
          <h2 className="font-display font-semibold text-xl text-[#1e1040]">GIF Gallery</h2>
          <p className="text-sm font-medium mt-0.5" style={{ color: "#a78bfa" }}>
            a new shuffle every day
          </p>
        </div>
        <TenorGifGrid />
      </div>

      {/* Footer note */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-400 font-medium">
          made with love for vrinda
        </p>
      </div>
    </div>
  );
}
