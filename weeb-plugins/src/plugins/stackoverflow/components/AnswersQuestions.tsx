/**
 * AnswersQuestions - Componente para exibir respostas e perguntas do Stack Overflow
 */

import React from "react"
import { FaQuestionCircle, FaReply } from "react-icons/fa"
import { IoStatsChartOutline } from "react-icons/io5"
import { AnimatedNumber } from "../../../templates/AnimatedNumber"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { StackOverflowConfig } from "../types"

interface AnswersQuestionsProps {
  answers: number
  questions: number
  config: StackOverflowConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function AnswersQuestions({
  answers,
  questions,
  config,
  style = "default",
  size = "half",
}: AnswersQuestionsProps): React.ReactElement {
  const hideTitle = config.nonEssential?.answers_questions_hide_title || false
  const hideQuestions = config.nonEssential?.answers_questions_hide_questions || false
  const title = config.nonEssential?.answers_questions_title || "Stack Overflow Activity"
  const stats = hideQuestions ? 1 : 2
  const cascade = useItemCascade(stats)

  return (
    <section id="stackoverflow-answers-questions">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className={withCascade("flex gap-4 half:gap-3 items-center w-full", cascade)} style={cascade?.style}>
              <div className="flex items-center gap-2 flex-1">
                <FaReply className="text-green-500 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <p className="text-sm text-default-muted">Answers:</p>
                  <p className="text-lg font-semibold text-default-highlight">
                    <AnimatedNumber value={abbreviateNumber(answers)} />
                  </p>
                </div>
              </div>
              {!hideQuestions && (
                <div className="flex items-center gap-2">
                  <FaQuestionCircle className="text-blue-500 flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-default-muted">Questions:</p>
                    <p className="text-lg font-semibold text-default-highlight">
                      <AnimatedNumber value={abbreviateNumber(questions)} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "stackoverflow",
                section: "answers_questions",
                size,
              })}
            />
            <CascadeGroup count={stats}>
              <TerminalLineWithDots title="Answers" value={abbreviateNumber(answers)} />
              {!hideQuestions && <TerminalLineWithDots title="Questions" value={abbreviateNumber(questions)} />}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
