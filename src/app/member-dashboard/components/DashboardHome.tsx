'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircleIcon,
  ChatBubbleOvalLeftIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';
import { getMyProductsCount } from '@/lib/supabase/database';

interface DashboardHomeProps {
  onNavigate?: (tab: string) => void;
}

const activities = [
  {
    id: 1,
    text: "Votre produit 'Café Robusta' a été approuvé",
    time: 'Il y a 2 heures',
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-400/10',
  },
  {
    id: 2,
    text: 'Nouveau message de Jean Mutombo',
    time: 'Il y a 3 heures',
    icon: ChatBubbleOvalLeftIcon,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
  },
  {
    id: 3,
    text: "Votre entreprise a reçu 21 vues aujourd'hui",
    time: 'Il y a 1 jour',
    icon: BuildingOfficeIcon,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
];

const chartData = [
  { month: 'Jan', value: 250 },
  { month: 'Fév', value: 480 },
  { month: 'Mar', value: 320 },
  { month: 'Avr', value: 750 },
  { month: 'Mai', value: 600 },
  { month: 'Juin', value: 1254 },
];

const maxVal = Math.max(...chartData.map((d) => d.value));

function LineChart() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setTimeout(() => {
        pathRef.current?.classList.add('animated');
      }, 300);
    }
  }, []);

  const w = 500;
  const h = 160;
  const padX = 36;
  const padY = 16;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2 - 16;

  const points = chartData.map((d, i) => ({
    x: padX + (i / (chartData.length - 1)) * chartW,
    y: padY + chartH - (d.value / maxVal) * chartH,
  }));

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = padY + (chartH / 5) * i;
          return (
            <line
              key={i}
              x1={padX}
              y1={y}
              x2={w - padX}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}
        {[1500, 1250, 1000, 750, 500, 250].map((v, i) => (
          <text
            key={v}
            x={padX - 6}
            y={padY + (chartH / 5) * i + 4}
            textAnchor="end"
            fontSize="9"
            fill="rgba(255,255,255,0.3)"
          >
            {v}
          </text>
        ))}
        <path d={areaD} fill="url(#chartGrad)" />
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#F5A623"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="chart-line-path"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#F5A623" stroke="#1A1A1A" strokeWidth="2" />
        ))}
        {chartData.map((d, i) => (
          <text
            key={d.month}
            x={points[i].x}
            y={h - 2}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.4)"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [productCountError, setProductCountError] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadCount = async () => {
      try {
        const count = await getMyProductsCount();
        if (mounted) {
          setProductCount(count);
          setProductCountError(false);
        }
      } catch {
        if (mounted) setProductCountError(true);
      }
    };

    const subscribe = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted || error || !data.user) return;

      channel = supabase
        .channel(`dashboard-products:${data.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
            filter: `vendor_id=eq.${data.user.id}`,
          },
          () => {
            void loadCount();
          }
        )
        .subscribe();
    };

    void loadCount();
    void subscribe();

    return () => {
      mounted = false;
      if (channel) void channel.unsubscribe();
    };
  }, [supabase]);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-foreground mb-1">
          Bienvenue, Christian Yukuwansompa 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Voici un aperçu de votre activité sur EmpireKongo.
        </p>
      </div>

      {/* Stats grid — 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground font-medium mb-3">Produits</p>
          <p className="text-3xl font-extrabold text-foreground mb-1">
            {productCount === null ? '—' : productCount}
          </p>
          <button
            onClick={() => onNavigate?.('products')}
            className="text-xs text-primary hover:underline text-left"
          >
            {productCountError ? 'Vérifier mes produits' : 'Voir mes produits'}
          </button>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground font-medium mb-3">Vues</p>
          <p className="text-3xl font-extrabold text-foreground mb-1">1,254</p>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
            +18% ce mois
          </p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground font-medium mb-3">Messages</p>
          <p className="text-3xl font-extrabold text-primary mb-1">8</p>
          <p className="text-xs text-muted-foreground">Nouveaux</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground font-medium mb-3">Favoris</p>
          <p className="text-3xl font-extrabold text-foreground mb-1">34</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">Vues de vos produits</h3>
              <p className="text-xs text-muted-foreground">(6 derniers mois)</p>
            </div>
          </div>
          <LineChart />
        </div>

        {/* Activity */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col">
          <h3 className="font-bold text-sm text-foreground mb-4">Activité récente</h3>
          <div className="flex flex-col gap-4 flex-1">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${act.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <act.icon className={`w-4 h-4 ${act.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{act.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
            Voir toutes les activités
          </button>
        </div>
      </div>
    </div>
  );
}
