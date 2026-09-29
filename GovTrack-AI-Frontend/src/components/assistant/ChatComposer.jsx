import { useRef, useState } from 'react'
import { assistantSuggestions } from '../../constants/assistantData'
import { Icon } from '../common/Icon'

export function ChatComposer({ onSend }) {
  const [draft, setDraft] = useState('')
  const [attachment, setAttachment] = useState(null)
  const fileInputRef = useRef(null)

  const submit = (event) => {
    event.preventDefault()
    if (!draft.trim() && !attachment) return
    onSend(draft.trim(), attachment?.name)
    setDraft('')
    setAttachment(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="assistant-compose-area">
      <div aria-label="Suggested questions" className="assistant-suggestions">{assistantSuggestions.map((suggestion) => <button key={suggestion} onClick={() => onSend(suggestion)} type="button">{suggestion}</button>)}</div>
      <form className="assistant-compose-form" onSubmit={submit}>
        <button aria-label="Attach a file" className="assistant-attach" onClick={() => fileInputRef.current?.click()} type="button"><Icon name="paperclip" size={19} /></button>
        <input accept=".pdf,.csv,.xlsx,.docx" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} ref={fileInputRef} tabIndex={-1} type="file" />
        <label className="sr-only" htmlFor="assistant-message-input">Ask the assistant</label>
        <input autoComplete="off" id="assistant-message-input" onChange={(event) => setDraft(event.target.value)} placeholder={attachment ? `Attached: ${attachment.name}` : 'Ask about any project, state, sector or metric...'} type="text" value={draft} />
        {attachment && <button aria-label="Remove attachment" className="assistant-remove-attachment" onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = '' }} type="button"><Icon name="close" size={15} /></button>}
        <button aria-label="Send message" className="assistant-send" disabled={!draft.trim() && !attachment} type="submit"><Icon name="send" size={18} /></button>
      </form>
    </div>
  )
}
