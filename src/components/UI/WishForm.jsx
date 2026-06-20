import React, { useState } from 'react'

export default function WishForm() {
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    // TODO: wire up submit handler
    alert(`Wish sent:\n${message}`)
    setMessage('')
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-xl">
      <label className="block text-sm text-slate-300 mb-2">Write your wish</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 rounded bg-slate-800 text-white"
        rows={4}
      />
      <button className="mt-3 px-4 py-2 bg-pink-500 text-white rounded" type="submit">Send Wish</button>
    </form>
  )
}
