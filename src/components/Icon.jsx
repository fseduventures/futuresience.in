import {
  ArrowRight, ArrowUpRight, Atom, Award, BookOpenCheck, BrainCircuit, CalendarDays, ChevronDown, ClipboardCheck,
  Clock, Dna, FlaskConical, Flame, GraduationCap, Laptop, Lightbulb, LineChart, Mail, MapPin, Menu, MessageCircle,
  MessagesSquare, Microscope, Phone, Quote, School, Search, ShieldCheck, Sigma, Sparkles, Star, Target, Telescope,
  TrendingUp, Trophy, Users, X, Zap, Instagram, Youtube, Facebook, Linkedin, CheckCircle2, Rocket, Medal, Send, Globe,
  Download, Building2, Navigation, Stethoscope, Pill, Cog, FileDown, Plus, BookMarked, Sun, Moon,
} from 'lucide-react'

// Explicit map keeps the bundle small (icons are referenced by name in data/site.js)
const icons = {
  ArrowRight, ArrowUpRight, Atom, Award, BookOpenCheck, BrainCircuit, CalendarDays, ChevronDown, ClipboardCheck,
  Clock, Dna, FlaskConical, Flame, GraduationCap, Laptop, Lightbulb, LineChart, Mail, MapPin, Menu, MessageCircle,
  MessagesSquare, Microscope, Phone, Quote, School, Search, ShieldCheck, Sigma, Sparkles, Star, Target, Telescope,
  TrendingUp, Trophy, Users, X, Zap, Instagram, Youtube, Facebook, Linkedin, CheckCircle2, Rocket, Medal, Send, Globe,
  Download, Building2, Navigation, Stethoscope, Pill, Cog, FileDown, Plus, BookMarked, Sun, Moon,
}

export default function Icon({ name, size = 22, strokeWidth = 1.8, ...rest }) {
  const Cmp = icons[name] || Sparkles
  return <Cmp size={size} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />
}
