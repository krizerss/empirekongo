'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Message {
  id: number;
  text: string;
  time: string;
  fromMe: boolean;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  phone: string;
  email: string;
  location: string;
  company: string;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: 'Jean Mutombo',
    avatar: 'JM',
    lastMessage: 'Bonjour, est-ce que le produit est encore disponible ?',
    time: '10:32',
    unread: 3,
    online: true,
    phone: '+243 812 345 678',
    email: 'jean.mutombo@email.com',
    location: 'Kinshasa, DRC',
    company: 'Mutombo Trading',
    messages: [
      { id: 1, text: 'Bonjour, est-ce que le produit est encore disponible ?', time: '10:28', fromMe: false },
      { id: 2, text: 'Oui, il est toujours disponible. Quelle quantité vous intéresse ?', time: '10:30', fromMe: true },
      { id: 3, text: 'Je voudrais commander 50 kg de café Robusta.', time: '10:31', fromMe: false },
      { id: 4, text: 'Quel est le prix pour cette quantité ?', time: '10:32', fromMe: false },
    ],
  },
  {
    id: 2,
    name: 'Marie Lukusa',
    avatar: 'ML',
    lastMessage: 'Merci pour la livraison rapide !',
    time: '09:15',
    unread: 0,
    online: false,
    phone: '+243 897 654 321',
    email: 'marie.lukusa@email.com',
    location: 'Lubumbashi, DRC',
    company: 'Lukusa Agro',
    messages: [
      { id: 1, text: 'Bonjour, j\'ai reçu ma commande.', time: '09:10', fromMe: false },
      { id: 2, text: 'Parfait ! Tout était en ordre ?', time: '09:12', fromMe: true },
      { id: 3, text: 'Merci pour la livraison rapide !', time: '09:15', fromMe: false },
    ],
  },
  {
    id: 3,
    name: 'Paul Nkosi',
    avatar: 'PN',
    lastMessage: 'D\'accord, je vous envoie le paiement.',
    time: 'Hier',
    unread: 1,
    online: true,
    phone: '+243 821 987 654',
    email: 'paul.nkosi@email.com',
    location: 'Goma, DRC',
    company: 'Nkosi Constructions',
    messages: [
      { id: 1, text: 'Avez-vous des matériaux de construction disponibles ?', time: 'Hier 14:00', fromMe: false },
      { id: 2, text: 'Oui, nous avons du ciment et du fer à béton.', time: 'Hier 14:05', fromMe: true },
      { id: 3, text: 'D\'accord, je vous envoie le paiement.', time: 'Hier 14:10', fromMe: false },
    ],
  },
  {
    id: 4,
    name: 'Ange Kabila',
    avatar: 'AK',
    lastMessage: 'Pouvez-vous me faire une réduction ?',
    time: 'Hier',
    unread: 0,
    online: false,
    phone: '+243 845 123 456',
    email: 'ange.kabila@email.com',
    location: 'Matadi, DRC',
    company: 'Kabila Mode',
    messages: [
      { id: 1, text: 'Bonjour, j\'aime beaucoup vos tissus.', time: 'Hier 11:00', fromMe: false },
      { id: 2, text: 'Merci ! Nous avons de nouvelles collections.', time: 'Hier 11:05', fromMe: true },
      { id: 3, text: 'Pouvez-vous me faire une réduction ?', time: 'Hier 11:10', fromMe: false },
    ],
  },
  {
    id: 5,
    name: 'Christelle Banza',
    avatar: 'CB',
    lastMessage: 'Je reviendrai la semaine prochaine.',
    time: 'Lun',
    unread: 0,
    online: false,
    phone: '+243 876 543 210',
    email: 'christelle.banza@email.com',
    location: 'Mbuji-Mayi, DRC',
    company: 'Banza Tech',
    messages: [
      { id: 1, text: 'Vos panneaux solaires sont-ils disponibles ?', time: 'Lun 09:00', fromMe: false },
      { id: 2, text: 'Oui, nous avons plusieurs modèles.', time: 'Lun 09:10', fromMe: true },
      { id: 3, text: 'Je reviendrai la semaine prochaine.', time: 'Lun 09:15', fromMe: false },
    ],
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [allConversations, setAllConversations] = useState<Conversation[]>(conversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = allConversations.find((c) => c.id === selectedId)!;

  const filtered = allConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, allConversations]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: newMessage,
              time: timeStr,
              messages: [
                ...c.messages,
                { id: c.messages.length + 1, text: newMessage, time: timeStr, fromMe: true },
              ],
            }
          : c
      )
    );
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Messages</h1>
        <p className="text-sm text-muted-foreground">Gérez vos conversations avec vos clients et partenaires.</p>
      </div>

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
                key={conv.id}
                onClick={() => {
                  setSelectedId(conv.id);
                  setAllConversations((prev) =>
                    prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                  );
                }}
                className={`w-full flex items-start gap-3 px-3 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors text-left ${
                  selectedId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{conv.avatar}</span>
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-card" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-foreground truncate">{conv.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{conv.time}</span>
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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card/80">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{selected.avatar}</span>
                </div>
                {selected.online && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-card" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <p className="text-[11px] text-muted-foreground">{selected.online ? 'En ligne' : 'Hors ligne'}</p>
              </div>
            </div>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selected.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.fromMe
                      ? 'bg-primary text-black rounded-br-sm' :'bg-secondary text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${msg.fromMe ? 'text-black/60' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </span>
                    {msg.fromMe && <CheckIcon className="w-3 h-3 text-black/60" />}
                  </div>
                </div>
              </div>
            ))}
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
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact info panel */}
        <div className="w-64 shrink-0 border-l border-border flex flex-col overflow-y-auto hidden xl:flex">
          <div className="p-4 border-b border-border text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-primary">{selected.avatar}</span>
            </div>
            <p className="font-bold text-foreground text-sm">{selected.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{selected.company}</p>
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${selected.online ? 'bg-green-400' : 'bg-muted-foreground/40'}`} />
              <span className="text-[11px] text-muted-foreground">{selected.online ? 'En ligne' : 'Hors ligne'}</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Coordonnées</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <PhoneIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <EnvelopeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground truncate">{selected.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground">{selected.location}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Entreprise</p>
              <div className="bg-secondary rounded-lg px-3 py-2.5 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-foreground font-medium">{selected.company}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Historique ({selected.messages.length} messages)
              </p>
              <div className="bg-secondary rounded-lg px-3 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Première conversation avec {selected.name.split(' ')[0]}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
