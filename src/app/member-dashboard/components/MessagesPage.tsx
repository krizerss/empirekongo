'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, PaperAirplaneIcon, EllipsisVerticalIcon, PhoneIcon, EnvelopeIcon, CheckIcon, ChatBubbleLeftRightIcon,  } from '@heroicons/react/24/outline';

import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DbMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Participant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

interface Conversation {
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: DbMessage[];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase() || '??';
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[date.getDay()];
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all messages involving the current user
  const fetchMessages = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data: msgs, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      if (!msgs || msgs.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Collect unique participant IDs
      const participantIds = Array.from(
        new Set(
          msgs.map((m: DbMessage) => (m.sender_id === user.id ? m.receiver_id : m.sender_id))
        )
      );

      // Fetch participant profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, avatar_url')
        .in('id', participantIds);

      if (profileError) throw profileError;

      const profileMap: Record<string, Participant> = {};
      (profiles || []).forEach((p: Participant) => {
        profileMap[p.id] = p;
      });

      // Group messages by participant
      const convMap: Record<string, Conversation> = {};
      msgs.forEach((m: DbMessage) => {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
        if (!otherId) return;
        if (!convMap[otherId]) {
          const profile = profileMap[otherId];
          convMap[otherId] = {
            participantId: otherId,
            participantName: profile?.full_name || profile?.email || 'Utilisateur',
            participantEmail: profile?.email || '',
            participantPhone: profile?.phone || '',
            lastMessage: '',
            lastTime: '',
            unread: 0,
            messages: [],
          };
        }
        convMap[otherId].messages.push(m);
        convMap[otherId].lastMessage = m.content;
        convMap[otherId].lastTime = m.created_at;
        if (!m.is_read && m.receiver_id === user.id) {
          convMap[otherId].unread += 1;
        }
      });

      const convList = Object.values(convMap).sort(
        (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
      );

      setConversations(convList);
      if (!selectedParticipantId && convList.length > 0) {
        setSelectedParticipantId(convList[0].participantId);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedParticipantId, conversations]);

  // Mark messages as read when selecting a conversation
  const handleSelectConversation = async (participantId: string) => {
    setSelectedParticipantId(participantId);
    if (!user) return;
    // Mark unread messages from this participant as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', participantId)
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    setConversations((prev) =>
      prev.map((c) =>
        c.participantId === participantId ? { ...c, unread: 0 } : c
      )
    );
  };

  // Send a message
  const handleSend = async () => {
    if (!newMessage.trim() || !user || !selectedParticipantId) return;
    setSending(true);
    try {
      const { data: inserted, error: sendError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedParticipantId,
          content: newMessage.trim(),
          is_read: false,
        })
        .select()
        .single();

      if (sendError) throw sendError;

      setConversations((prev) =>
        prev.map((c) =>
          c.participantId === selectedParticipantId
            ? {
                ...c,
                messages: [...c.messages, inserted],
                lastMessage: inserted.content,
                lastTime: inserted.created_at,
              }
            : c
        )
      );
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filtered = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selected = conversations.find((c) => c.participantId === selectedParticipantId);

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-foreground mb-1">Messages</h1>
          <p className="text-sm text-muted-foreground">Gérez vos conversations avec vos clients et partenaires.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Chargement des messages...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Empty state ───────────────────────────────────────────────────────────

  if (!loading && conversations.length === 0) {
    return (
      <div>
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-foreground mb-1">Messages</h1>
          <p className="text-sm text-muted-foreground">Gérez vos conversations avec vos clients et partenaires.</p>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-base font-bold text-foreground mb-1">Aucun message</p>
          <p className="text-sm text-muted-foreground">
            Vos conversations avec vos clients et partenaires apparaîtront ici.
          </p>
        </div>
      </div>
    );
  }

  // ─── Main UI ───────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Messages</h1>
        <p className="text-sm text-muted-foreground">Gérez vos conversations avec vos clients et partenaires.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* Conversation list */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => (
              <button
                key={conv.participantId}
                onClick={() => handleSelectConversation(conv.participantId)}
                className={`w-full flex items-start gap-3 px-3 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors text-left ${
                  selectedParticipantId === conv.participantId
                    ? 'bg-primary/5 border-l-2 border-l-primary' :''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{getInitials(conv.participantName)}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-foreground truncate">{conv.participantName}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                      {conv.lastTime ? formatTime(conv.lastTime) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate flex-1">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-1 shrink-0 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-black flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat thread */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card/80">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{getInitials(selected.participantName)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selected.participantName}</p>
                  <p className="text-[11px] text-muted-foreground">{selected.participantEmail}</p>
                </div>
              </div>
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selected.messages.map((msg) => {
                const fromMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        fromMe
                          ? 'bg-primary text-black rounded-br-sm' :'bg-secondary text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${fromMe ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[10px] ${fromMe ? 'text-black/60' : 'text-muted-foreground'}`}>
                          {formatTime(msg.created_at)}
                        </span>
                        {fromMe && (
                          <CheckIcon className={`w-3 h-3 ${msg.is_read ? 'text-blue-400' : 'text-black/60'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrire un message..."
                  className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Sélectionnez une conversation</p>
            </div>
          </div>
        )}

        {/* Contact info panel */}
        {selected && (
          <div className="w-64 shrink-0 border-l border-border flex flex-col overflow-y-auto hidden xl:flex">
            <div className="p-4 border-b border-border text-center">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">{getInitials(selected.participantName)}</span>
              </div>
              <p className="font-bold text-foreground text-sm">{selected.participantName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{selected.participantEmail}</p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Coordonnées</p>
                <div className="space-y-2.5">
                  {selected.participantEmail && (
                    <div className="flex items-center gap-2.5">
                      <EnvelopeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground truncate">{selected.participantEmail}</span>
                    </div>
                  )}
                  {selected.participantPhone && (
                    <div className="flex items-center gap-2.5">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground">{selected.participantPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Historique ({selected.messages.length} messages)
                </p>
                <div className="bg-secondary rounded-lg px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">
                    {selected.messages.length} message{selected.messages.length > 1 ? 's' : ''} échangé{selected.messages.length > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
