import Latex from "react-latex-next"

interface ExplanationProps {
  questionType: string
  content: string
}

export default function Explanation({ questionType, content }: ExplanationProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-base md:text-lg font-medium mb-2">{questionType} Explanation</h3>
      <div className="text-xs md:text-sm text-gray-700">
        <Latex>{content}</Latex>
      </div>
    </div>
  )
}

