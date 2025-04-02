export function ProfileSkillTags({ skills }) {
  if (!skills || skills.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 shadow-sm"
          style={getSkillStyle(skill)}
        >
          {getSkillIcon(skill)}
          {skill}
        </div>
      ))}
    </div>
  )
}

function getSkillStyle(skill) {
  const skillMap = {
    Python: { bg: "bg-green-50", text: "text-green-700", border: "border border-green-200" },
    JavaScript: { bg: "bg-green-50", text: "text-green-700", border: "border border-green-200" },
    "Machine Learning": { bg: "bg-green-50", text: "text-green-700", border: "border border-green-200" },
    "React.js": { bg: "bg-green-50", text: "text-green-700", border: "border border-green-200" },
    "Microsoft Excel": { bg: "bg-green-50", text: "text-green-700", border: "border border-green-200" },
    // Default style for other skills
    default: { bg: "bg-green-50", text: "text-green-700", border: "border border-green-200" },
  }

  return {
    backgroundColor: skillMap[skill]?.bg || skillMap.default.bg,
    color: skillMap[skill]?.text || skillMap.default.text,
    borderColor: skillMap[skill]?.border || skillMap.default.border,
  }
}

function getSkillIcon(skill) {
  switch (skill) {
    case "Python":
      return <span className="text-sm">🐍</span>
    case "JavaScript":
      return <span className="text-sm">JS</span>
    case "Machine Learning":
      return <span className="text-sm">🧠</span>
    case "React.js":
      return <span className="text-sm">⚛️</span>
    case "Microsoft Excel":
      return <span className="text-sm">📊</span>
    default:
      return null
  }
}

