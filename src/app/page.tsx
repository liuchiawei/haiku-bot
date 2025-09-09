'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ToolUIPart } from 'ai';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import { Tool, ToolContent, ToolHeader } from '@/components/ai-elements/tool';
import { Loader } from '@/components/ai-elements/loader';
import { Response } from '@/components/ai-elements/response';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import { Plus } from 'lucide-react';

const ChatBotDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className='max-w-4xl h-full min-h-svh mx-auto pt-6 pb-12 relative size-full flex flex-col justify-between'>
      <Conversation className='h-full'>
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === 'assistant' &&
                message.parts.filter((part) => part.type === 'source-url')
                  .length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === 'source-url',
                        ).length
                      }
                    />
                    {message.parts
                      .filter((part) => part.type === 'source-url')
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <Response>{part.text}</Response>
                          </MessageContent>
                        </Message>
                      </div>
                    );
                  case 'tool-haiku_generation':
                    // 直接使用當前 part 的資料，而不是全域的 haikuTool
                    const currentHaikuTool = part as HaikuToolUIPart;
                    return (
                      <Tool
                        key={`${message.id}-${i}`}
                        defaultOpen={true}
                        className='flex justify-center h-full min-h-96'
                      >
                        <ToolContent className='flex flex-col justify-end p-8 text-3xl md:text-5xl tracking-wider leading-24 [writing-mode:vertical-rl] *:data-[line="0"]:self-start *:data-[line="1"]:self-center *:data-[line="2"]:self-end'>
                          {currentHaikuTool.output?.haiku
                            .split('\n')
                            .map((line, index) => (
                              <div
                                key={index}
                                data-line={index}
                                className='font-serif'
                              >
                                {line}
                              </div>
                            ))}
                        </ToolContent>
                      </Tool>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
          {status === 'submitted' && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput onSubmit={handleSubmit} className='mt-4'>
        <PromptInputTextarea
          placeholder="What's your haiku theme..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <PromptInputToolbar>
          <PromptInputButton>
            <Plus className='size-4' />
          </PromptInputButton>
          <PromptInputSubmit disabled={!input} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default ChatBotDemo;

type HaikuToolInput = {
  theme: string;
};

type HaikuToolOutput = {
  haiku: string;
};

type HaikuToolUIPart = ToolUIPart<{
  haiku_generation: {
    input: HaikuToolInput;
    output: HaikuToolOutput;
  };
}>;
