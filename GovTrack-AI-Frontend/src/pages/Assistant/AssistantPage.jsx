import { useEffect, useRef, useState } from 'react'
import { assistantBackground, govTrackLogo } from '../../assets'
import { createDemoReply, demoConversations } from '../../constants/assistantData'
import { AssistantIntro } from '../../components/assistant/AssistantIntro'
import { ChatComposer } from '../../components/assistant/ChatComposer'
import { ChatHistory } from '../../components/assistant/ChatHistory'
import { ChatMessage } from '../../components/assistant/ChatMessage'
import { Icon } from '../../components/common/Icon'
import { SiteHeader } from '../../components/layout/SiteHeader'
import './AssistantPage.css'

function ChatThread({ conversation }) {
  const scrollRef = useRef(null)
  const messageCount = conversation?.messages.length ?? 0

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = messageCount > 2 ? scrollRef.current.scrollHeight : 0
  }, [conversation?.id, messageCount])

  return (
    <div aria-label="Conversation" aria-live="polite" className="assistant-thread" ref={scrollRef}>
      {conversation ? conversation.messages.map((message, index) => <ChatMessage key={`${conversation.id}-${index}`} message={message} />) : <div className="assistant-empty-chat"><span><Icon name="bot" size={32} /></span><h2>How can I help today?</h2><p>Ask about a project, state, sector, cost or delay. This preview uses demo data.</p></div>}
    </div>
  )
}

function AssistantWorkspace({ activeConversation, activeId, conversations, onClear, onNew, onSearchChange, onSelect, onSend, searchQuery }) {
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <section aria-label="GovTrack AI chat preview" className="assistant-workspace">
      <ChatHistory activeId={activeId} conversations={conversations} isOpen={historyOpen || Boolean(searchQuery)} onClear={onClear} onClose={() => setHistoryOpen(false)} onNew={onNew} onSearchChange={onSearchChange} onSelect={onSelect} searchQuery={searchQuery} />
      <div className="assistant-chat-pane">
        <div className="assistant-mobile-chatbar"><strong><img alt="" aria-hidden="true" src={govTrackLogo} /> GovTrack AI <span>Demo</span></strong><button aria-controls="assistant-history" aria-expanded={historyOpen} onClick={() => setHistoryOpen((current) => !current)} type="button"><Icon name="chat" size={17} /> History</button></div>
        <ChatThread conversation={activeConversation} />
        <ChatComposer key={activeId ?? 'new'} onSend={onSend} />
      </div>
    </section>
  )
}

export function AssistantPage({ embedded = false }) {
  const [conversations, setConversations] = useState(demoConversations)
  const [activeId, setActiveId] = useState(demoConversations[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const activeConversation = conversations.find((conversation) => conversation.id === activeId)

  const sendMessage = (question, attachmentName) => {
    const text = [question, attachmentName ? `Attachment: ${attachmentName}` : null].filter(Boolean).join('\n')
    if (!text) return

    const newMessages = [
      { role: 'user', text },
      { role: 'assistant', text: createDemoReply(question, Boolean(attachmentName)) },
    ]

    if (activeId) {
      setConversations((current) => current.map((conversation) => conversation.id === activeId ? { ...conversation, messages: [...conversation.messages, ...newMessages], time: 'just now' } : conversation))
    } else {
      const id = `preview-${Date.now()}`
      setConversations((current) => [{ id, title: question.slice(0, 42) || attachmentName, time: 'just now', messages: newMessages }, ...current])
      setActiveId(id)
    }
  }

  const clearHistory = () => {
    setConversations([])
    setActiveId(null)
    setSearchQuery('')
  }

  return (
    <main className={`assistant-page${embedded ? ' assistant-page-embedded' : ''}`} style={embedded ? undefined : { '--assistant-background': `url(${assistantBackground})` }}>
      {!embedded && <SiteHeader page="assistant" />}
      <div className="assistant-page-body">
        {!embedded && <AssistantIntro />}
        <AssistantWorkspace activeConversation={activeConversation} activeId={activeId} conversations={conversations} onClear={clearHistory} onNew={() => setActiveId(null)} onSearchChange={setSearchQuery} onSelect={setActiveId} onSend={sendMessage} searchQuery={searchQuery} />
      </div>
    </main>
  )
}
