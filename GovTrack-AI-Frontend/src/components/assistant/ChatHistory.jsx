import { Icon } from '../common/Icon'
import { Logo } from '../layout/SiteHeader'

export function ChatHistory({ activeId, conversations, isOpen, onClear, onClose, onNew, onSearchChange, onSelect, searchQuery }) {
  const visibleConversations = conversations.filter((conversation) => conversation.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <aside aria-label="Chat history" className={`assistant-history${isOpen ? ' is-open' : ''}`} id="assistant-history">
      <div className="assistant-history-brand"><Logo government href="/" /></div>
      <button className="assistant-new-chat" onClick={() => { onNew(); onClose() }} type="button"><span><Icon name="plus" size={16} /></span> New Chat</button>
      <label className="assistant-history-search"><Icon name="search" size={15} /><span className="sr-only">Search recent queries</span><input onChange={(event) => onSearchChange(event.target.value)} placeholder="Search chats..." type="search" value={searchQuery} /></label>
      <div className="assistant-history-heading"><strong>Recent Queries</strong><button disabled={conversations.length === 0} onClick={onClear} type="button">Clear</button></div>
      <div className="assistant-history-list">
        {visibleConversations.length === 0 ? <p className="assistant-history-empty">{searchQuery ? 'No matching queries' : 'No recent chats yet'}</p> : visibleConversations.map((conversation) => <button aria-pressed={conversation.id === activeId} className={`assistant-history-item${conversation.id === activeId ? ' is-active' : ''}`} key={conversation.id} onClick={() => { onSelect(conversation.id); onClose() }} type="button">
          <span className="assistant-history-icon"><Icon name="chat" size={15} /></span>
          <span><strong>{conversation.title}</strong><small>{conversation.time}</small></span>
        </button>)}
      </div>
    </aside>
  )
}
