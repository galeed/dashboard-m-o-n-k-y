"use client"

import { useMemo, useState } from "react"
import {
  AudioLines,
  ChevronDown,
  Disc3,
  Download,
  Gauge,
  Headphones,
  ListMusic,
  Maximize2,
  Menu,
  Pause,
  Play,
  Repeat2,
  RotateCcw,
  RotateCw,
  Search,
  Settings2,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume2,
  Waves,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const tracks = [
  { title: "Everything In Its Right Place", artist: "Radiohead", album: "Kid A", time: "4:11", quality: "24-bit / 44.1 kHz", cover: "#c6b6a2" },
  { title: "Teardrop", artist: "Massive Attack", album: "Mezzanine", time: "5:30", quality: "24-bit / 96 kHz", cover: "#4d5a58" },
  { title: "Angel", artist: "Massive Attack", album: "Mezzanine", time: "6:19", quality: "24-bit / 96 kHz", cover: "#4d5a58" },
  { title: "Roads", artist: "Portishead", album: "Dummy", time: "5:02", quality: "24-bit / 48 kHz", cover: "#8b7668" },
]

const bars = Array.from({ length: 46 }, (_, index) => 18 + ((index * 17) % 62))
const frequencies = ["32", "64", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"]

function Visualizer({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <div className={`flex h-full items-center justify-center gap-1 ${mirrored ? "flex-row-reverse" : ""}`} aria-label="Audio spectrum visualizer">
      {bars.map((height, index) => (
        <span
          key={index}
          className="w-1 rounded-full bg-primary/70 animate-spectrum"
          style={{ height: `${height}%`, animationDelay: `${index * -70}ms`, opacity: index % 4 === 0 ? 0.38 : 0.8 }}
        />
      ))}
    </div>
  )
}

function AlbumArtwork({ cover }: { cover: string }) {
  return (
    <div className="relative aspect-square w-full max-w-[22rem] overflow-hidden border border-border bg-card shadow-2xl">
      <div className="absolute inset-0 opacity-70" style={{ backgroundColor: cover }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,.75),transparent_21%),linear-gradient(135deg,transparent_34%,rgba(0,0,0,.75) 35%,rgba(0,0,0,.08) 67%,rgba(255,255,255,.22) 68%,transparent 69%)]" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-background mix-blend-hard-light">
        <p className="font-display text-4xl leading-none tracking-tight">KID A</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em]">Radiohead · 2000</p>
      </div>
      <div className="absolute right-5 top-5 rounded-full border border-background/40 p-2 text-background/70"><Disc3 className="size-5" /></div>
    </div>
  )
}

function Equalizer() {
  const [values, setValues] = useState(frequencies.map((_, index) => index % 3 === 0 ? 4 : index % 4 === 0 ? -3 : 0))
  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]"><SlidersHorizontal className="size-4 text-primary" /> Parametric EQ</CardTitle>
        <Badge variant="outline" className="font-mono text-[9px] uppercase">Neutral</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-2 pt-3">
          {frequencies.map((frequency, index) => (
            <div key={frequency} className="flex min-w-0 flex-col items-center gap-2">
              <span className="font-mono text-[9px] text-muted-foreground">{values[index] > 0 ? "+" : ""}{values[index]}</span>
              <div className="flex h-24 items-center">
                <Slider orientation="vertical" value={[values[index] + 12]} min={0} max={24} step={1} onValueChange={([value]) => setValues((current) => current.map((item, itemIndex) => itemIndex === index ? value - 12 : item))} className="h-20" aria-label={`${frequency} hertz gain`} />
              </div>
              <span className="font-mono text-[9px] text-muted-foreground">{frequency}</span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Preamp <strong className="text-foreground">0.0 dB</strong></span><span>Output <strong className="text-success">-0.2 dB</strong></span><span>Oversampling <strong className="text-foreground">4x</strong></span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState([38])
  const [volume, setVolume] = useState([78])
  const [showQueue, setShowQueue] = useState(false)
  const [showEq, setShowEq] = useState(false)
  const track = tracks[currentIndex]
  const elapsed = useMemo(() => `${Math.floor((247 * progress[0]) / 100 / 60)}:${String(Math.floor((247 * progress[0]) / 100) % 60).padStart(2, "0")}`, [progress])

  const next = () => setCurrentIndex((index) => (index + 1) % tracks.length)
  const previous = () => setCurrentIndex((index) => (index - 1 + tracks.length) % tracks.length)

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border/70 px-4 md:px-8">
        <div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center bg-primary text-primary-foreground"><Waves className="size-4" /></div><span className="font-display text-xl tracking-tight">SONIC / <span className="text-primary">LOSSLESS</span></span></div>
        <div className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:flex"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" />Audio engine online</span><span>FLAC library · 2,481 tracks</span></div>
        <Button variant="outline" size="icon" className="size-8" aria-label="Open settings"><Settings2 className="size-4" /></Button>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[minmax(100px,1fr)_minmax(560px,760px)_minmax(100px,1fr)]">
        <aside className="hidden border-r border-border/60 px-4 py-8 lg:block"><div className="sticky top-8 flex h-[calc(100vh-10rem)] flex-col items-center gap-5"><span className="font-mono text-[9px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] text-muted-foreground">LEFT CHANNEL / 01</span><div className="w-full flex-1"><Visualizer /></div><span className="font-mono text-[9px] text-primary [writing-mode:vertical-rl]">L 0.2 dB</span></div></aside>

        <section className="flex flex-col px-5 py-7 md:px-12 md:py-10">
          <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><span className="flex items-center gap-2"><Headphones className="size-3" />Now decoding</span><span className="text-primary">{track.quality}</span></div>
          <div className="flex flex-1 flex-col items-center justify-center"><AlbumArtwork cover={track.cover} /><div className="mt-7 w-full max-w-[22rem] text-center"><h1 className="font-display text-3xl leading-tight">{track.title}</h1><p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{track.artist} <span className="mx-2 text-border">/</span> {track.album}</p></div>
            <div className="mt-8 w-full max-w-[32rem]"><div className="mb-2 flex justify-between font-mono text-[10px] text-muted-foreground"><span>{elapsed}</span><span>4:11</span></div><Slider value={progress} onValueChange={setProgress} max={100} step={1} aria-label="Track progress" /></div>
            <div className="mt-6 flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Shuffle"><Shuffle className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="Previous track" onClick={previous}><SkipBack className="size-5" /></Button><Button size="icon" className="size-14 rounded-full" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}</Button><Button variant="ghost" size="icon" aria-label="Next track" onClick={next}><SkipForward className="size-5" /></Button><Button variant="ghost" size="icon" aria-label="Repeat"><Repeat2 className="size-4" /></Button></div>
            <div className="mt-7 flex w-full max-w-[22rem] items-center gap-3"><Volume2 className="size-4 text-muted-foreground" /><Slider value={volume} onValueChange={setVolume} max={100} step={1} aria-label="Volume" /><span className="w-8 text-right font-mono text-[10px] text-muted-foreground">{volume}%</span></div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2"><Button variant={showQueue ? "secondary" : "outline"} size="sm" onClick={() => setShowQueue(!showQueue)}><ListMusic data-icon="inline-start" />Queue</Button><Button variant={showEq ? "secondary" : "outline"} size="sm" onClick={() => setShowEq(!showEq)}><Gauge data-icon="inline-start" />Equalizer</Button><Button variant="outline" size="sm"><Download data-icon="inline-start" />Export metadata</Button></div>
          {showEq && <div className="mt-6"><Equalizer /></div>}
          {showQueue && <Card className="mt-6 border-border/70 bg-card/60"><CardHeader className="flex-row items-center justify-between space-y-0 pb-3"><CardTitle className="text-xs uppercase tracking-[0.2em]">Up next</CardTitle><span className="font-mono text-[10px] text-muted-foreground">{tracks.length} tracks</span></CardHeader><CardContent className="grid gap-1">{tracks.map((item, index) => <button key={item.title} onClick={() => { setCurrentIndex(index); setPlaying(true) }} className={`flex items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-accent ${index === currentIndex ? "bg-accent" : ""}`}><span className="w-5 font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="size-7 shrink-0" style={{ backgroundColor: item.cover }} /><span className="min-w-0 flex-1 truncate text-xs">{item.title}</span><span className="font-mono text-[10px] text-muted-foreground">{item.time}</span></button>)}</CardContent></Card>}
        </section>

        <aside className="hidden border-l border-border/60 px-4 py-8 lg:block"><div className="sticky top-8 flex h-[calc(100vh-10rem)] flex-col items-center gap-5"><span className="font-mono text-[9px] uppercase tracking-[0.3em] [writing-mode:vertical-rl] text-muted-foreground">RIGHT CHANNEL / 02</span><div className="w-full flex-1"><Visualizer mirrored /></div><span className="font-mono text-[9px] text-primary [writing-mode:vertical-rl]">R 0.1 dB</span></div></aside>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground md:px-8"><span className="flex items-center gap-2"><AudioLines className="size-3 text-primary" />Bit-perfect playback enabled</span><span>Exclusive mode · WASAPI</span><span>48 kHz / 24 bit · Stereo</span></footer>
    </main>
  )
}

export { RotateCcw, RotateCw, ChevronDown, Maximize2, Menu, Search }
import "./music-player.css"
