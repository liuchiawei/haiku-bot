'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { Image } from '@/components/ai-elements/image';
import { Loader } from '@/components/ai-elements/loader';
import { ToolUIPart } from 'ai';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';

const ChatBotDemo = () => {
  const [ input, setInput ] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  // 移除全域的 tool 變數，讓每個訊息使用自己的 tool 資料

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === 'source-url',
                        ).length
                      }
                    />
                    {message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
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
                              <Response>
                                {part.text}
                              </Response>
                            </MessageContent>
                          </Message>
                        </div>
                      );
                    case 'tool-haiku_generation':
                      // 直接使用當前 part 的資料，而不是全域的 haikuTool
                      const currentHaikuTool = part as HaikuToolUIPart;
                      return (
                        <Tool key={`${message.id}-${i}`} defaultOpen={true}>
                          <ToolHeader type="tool-haiku_generation" state={currentHaikuTool.state} />
                          <ToolContent className='p-4 text-3xl'>
                            {/* <ToolInput input={currentHaikuTool.input} /> */}
                            {/* <ToolOutput
                              output={
                                <Response>
                                  {currentHaikuTool.output?.haiku}
                                </Response>
                              }
                              errorText={currentHaikuTool.errorText}
                            /> */}
                            {currentHaikuTool.output?.haiku.split('\n').map((line, index) => (
                              <div key={index} className='font-serif'>{line}</div>
                            ))}
                          </ToolContent>
                        </Tool>
                      )
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

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            placeholder="What's your haiku theme..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
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

type ImageToolUIPart = ToolUIPart<{
  image_generation: {
    input: ImageToolInput;
    output: ImageToolOutput;
  };
}>;

type ImageToolInput = {
  haiku: string;
};

type ImageToolOutput = {
  image: string;
};