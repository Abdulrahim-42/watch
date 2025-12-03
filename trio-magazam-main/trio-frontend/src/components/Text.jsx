"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Container from "../components/ui/Container"

export default function ContentCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  const shortText =
    "Then the question arises: where's the content? Not there yet? That's not so bad, there's dummy copy to the rescue. But worse, what if the fish doesn't fit in the can, the foot's to big for the boot? Or to small? To short sentences, to many headings, images too large for the proposed design, or too small, or they fit in but it looks iffy for reasons."

  const fullText =
    "A client that's unhappy for a reason is a problem, a client that's unhappy though he or her can't quite put a finger on it is worse. Chances are there wasn't collaboration, communication, and checkpoints, there wasn't a process agreed upon or specified with the granularity required. It's content strategy gone awry right from the start. If that's what you think how bout the other way around? How can you evaluate content without design? No typography, no colors, no layout, no styles, all those things that convey the important signals that go beyond the mere textual, hierarchies of information, weight, emphasis, oblique stresses, priorities, all those subtle cues that also have visual and emotional appeal to the reader."

  return (
    <Container>
        <div className="w-full bg-white rounded-lg shadow-sm p-8 md:p-12">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">
        Online store of household appliances and electronics
      </h1>

      {/* First paragraph */}
      <p className="text-gray-600 text-base leading-relaxed mb-4">{shortText}</p>

      {/* Second paragraph - conditionally expanded */}
      {isExpanded && <p className="text-gray-600 text-base leading-relaxed mb-6">{fullText}</p>}

      {/* Read More Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors duration-200"
      >
        Read More
        <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
      </button>
    </div>
    </Container>
  )
}
