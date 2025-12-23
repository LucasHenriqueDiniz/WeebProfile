/**
 * AnswersQuestions - Componente para exibir respostas e perguntas do Stack Overflow
 */

import React from 'react'
import { FaQuestionCircle, FaReply } from 'react-icons/fa'
import { IoStatsChartOutline } from 'react-icons/io5'
import { DefaultTitle } from '../../../templates/Default/DefaultTitle.js'
import { RenderBasedOnStyle } from '../../../templates/RenderBasedOnStyle.js'
import { TerminalCommand } from '../../../templates/Terminal/TerminalCommand.js'
import { TerminalLineWithDots } from '../../../templates/Terminal/TerminalLineWithDots.js'
import { abbreviateNumber } from '../../../utils/number.js'
import { getPseudoCommands } from '../../../utils/pseudo-commands.js'
import type { StackOverflowConfig } from '../types.js'

interface AnswersQuestionsProps {
  answers: number
  questions: number
  config: StackOverflowConfig
  style?: 'default' | 'terminal'
  size?: 'half' | 'full'
}

export function AnswersQuestions({ answers, questions, config, style = 'default', size = 'half' }: AnswersQuestionsProps): React.ReactElement {
  const hideTitle = config.nonEssential?.answers_questions_hide_title || false
  const hideQuestions = config.nonEssential?.answers_questions_hide_questions || false
  const title = config.nonEssential?.answers_questions_title || 'Stack Overflow Activity'

  return (
    <section id="stackoverflow-answers-questions">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="flex gap-4 half:gap-3 items-center w-full">
              <div className="flex items-center gap-2 flex-1">
                <FaReply className="text-green-500 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <p className="text-sm text-default-muted">Answers:</p>
                  <p className="text-lg font-semibold text-default-highlight">{abbreviateNumber(answers)}</p>
                </div>
              </div>
              {!hideQuestions && (
                <div className="flex items-center gap-2">
                  <FaQuestionCircle className="text-blue-500 flex-shrink-0" />
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-default-muted">Questions:</p>
                    <p className="text-lg font-semibold text-default-highlight">{abbreviateNumber(questions)}</p>
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
                plugin: 'stackoverflow',
                section: 'answers_questions',
                size,
              })}
            />
            <TerminalLineWithDots
              title="Answers"
              value={abbreviateNumber(answers)}
            />
            {!hideQuestions && (
              <TerminalLineWithDots
                title="Questions"
                value={abbreviateNumber(questions)}
              />
            )}
          </>
        }
      />
    </section>
  )
}


