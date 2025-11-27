"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, GripVertical, Check, Circle, Loader2, Github, Music, Film, Home, Plus, ChevronLeft, Save, Search, Moon, Sun, LogOut, Settings as SettingsIcon, Code, LucideIcon, X, Menu, Eye, EyeOff, Maximize2, Copy, CheckCheck, Image as ImageIcon } from 'lucide-react';

// Types
type StepStatus = 'complete' | 'current' | 'pending';

interface Plugin {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  username?: string;
  selectedSections?: string[];
}

interface PluginSection {
  id: string;
  label: string;
  hasConfig: boolean;
}

type PluginSectionsMap = {
  [key: string]: PluginSection[];
};

interface FormData {
  name: string;
  slug: string;
  size: 'half' | 'full';
  style: 'default' | 'terminal';
  primaryColor: string;
  customCSS: string;
}

// Mock data
const availablePlugins: Plugin[] = [
  { id: 'github', name: 'GitHub', icon: Github, color: 'bg-gray-900' },
  { id: 'lastfm', name: 'LastFM', icon: Music, color: 'bg-red-600' },
  { id: 'myanimelist', name: 'MyAnimeList', icon: Film, color: 'bg-blue-600' },
  { id: 'spotify', name: 'Spotify', icon: Music, color: 'bg-green-600' },
  { id: 'twitter', name: 'Twitter', icon: Film, color: 'bg-sky-500' },
  { id: 'instagram', name: 'Instagram', icon: Film, color: 'bg-pink-600' }
];

const pluginSections: PluginSectionsMap = {
  github: [
    { id: 'profile', label: 'Profile', hasConfig: false },
    { id: 'activity', label: 'Activity', hasConfig: true },
    { id: 'calendar', label: 'Calendar', hasConfig: true },
    { id: 'repositories', label: 'Repositories', hasConfig: true },
    { id: 'languages', label: 'Favorite Languages', hasConfig: true }
  ],
  lastfm: [
    { id: 'recent', label: 'Recent Tracks', hasConfig: true },
    { id: 'top-tracks', label: 'Top Tracks', hasConfig: true },
    { id: 'top-artists', label: 'Top Artists', hasConfig: true },
    { id: 'top-albums', label: 'Top Albums', hasConfig: true }
  ],
  myanimelist: [
    { id: 'statistics', label: 'Statistics', hasConfig: false },
    { id: 'anime-fav', label: 'Anime Favorites', hasConfig: true },
    { id: 'manga-fav', label: 'Manga Favorites', hasConfig: true },
    { id: 'char-fav', label: 'Character Favorites', hasConfig: true }
  ]
};

// Preview Panel Component
const PreviewPanel = ({ formData, activePlugins, darkMode, isVisible }: any) => {
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://weebprofile.com/api/${formData.slug || 'seu-slug'}.svg`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'lg:w-96'} ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} border-l ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex flex-col`}>
      {/* Preview Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preview</span>
        </div>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-200'}`}
        >
          {fullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 mb-4`}>
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            {activePlugins.length > 0 ? (
              <div className="text-center space-y-4 w-full">
                <Loader2 className={`w-8 h-8 mx-auto animate-spin ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gerando preview...
                </div>
                
                {/* Mockup do que seria renderizado */}
                <div className={`mt-6 space-y-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {activePlugins.map((plugin: Plugin) => (
                    <div key={plugin.id} className={`p-2 rounded ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                      {plugin.name} - {plugin.selectedSections?.length || 0} sections
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Film className={`w-12 h-12 mx-auto mb-3 opacity-30 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Adicione plugins para ver o preview
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className={`rounded-xl border p-4 space-y-3 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>INFORMAÇÕES</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tamanho:</span>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formData.size === 'half' ? '415x600px' : '830x600px'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Estilo:</span>
              <span className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formData.style}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Plugins:</span>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {activePlugins.length}
              </span>
            </div>
          </div>

          <div className={`pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <label className={`text-xs font-semibold block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              URL DA IMAGEM
            </label>
            <div className="flex gap-2">
              <code className={`flex-1 px-3 py-2 rounded text-xs font-mono ${darkMode ? 'bg-gray-950 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                .../{formData.slug || 'seu-slug'}.svg
              </code>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-2 rounded transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Top Navigation Bar
const TopNavBar = ({ currentStep, darkMode, onToggleDarkMode, showPreview, onTogglePreview }: any) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const stepNames: Record<number, string> = {
    1: 'Básico',
    2: 'Estilo',
    3: 'Plugins',
    4: 'Finalizar'
  };

  return (
    <nav className={`border-b px-6 py-3 flex items-center justify-between ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5" />
          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>WeebProfile</span>
        </div>

        <div className={`h-6 w-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                step === currentStep 
                  ? darkMode ? 'bg-blue-950 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : step < currentStep
                  ? darkMode ? 'bg-green-950 text-green-400' : 'bg-green-50 text-green-600'
                  : darkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-xs font-bold">{step}</span>
                )}
                <span className="text-xs font-medium hidden sm:inline">{stepNames[step]}</span>
              </div>
              {step < 4 && (
                <ChevronRight className={`w-3 h-3 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePreview}
          className={`p-2 rounded-lg transition-colors ${
            showPreview 
              ? darkMode ? 'bg-blue-950 text-blue-400' : 'bg-blue-50 text-blue-600'
              : darkMode ? 'hover:bg-gray-900 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className={`h-6 w-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
            <ChevronDown className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>

          {userMenuOpen && (
            <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="p-3 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}">
                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>john@example.com</div>
              </div>
              <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                <SettingsIcon className="w-4 h-4" />
                <span>Configurações</span>
              </button>
              <div className={`h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${darkMode ? 'text-red-400 hover:bg-red-950' : 'text-red-600 hover:bg-red-50'}`}>
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Step Components
const Step1Basic = ({ formData, onChange, darkMode }: any) => {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informações Básicas</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Defina o nome e identificador único da sua imagem.
        </p>
      </div>

      <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Nome da Imagem *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Meu Profile GitHub"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-600' : 'bg-white border-gray-300 placeholder-gray-400'}`}
        />
      </div>

      <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Slug (URL) *
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder="meu-profile-github"
          className={`w-full px-4 py-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-600' : 'bg-white border-gray-300 placeholder-gray-400'}`}
        />
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Apenas letras minúsculas, números e hífens (a-z, 0-9, -)
        </p>
      </div>
    </div>
  );
};

const Step2Style = ({ formData, onChange, darkMode }: any) => {
  const [showCustomCSS, setShowCustomCSS] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Estilo e Aparência</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Personalize o visual da sua imagem.
        </p>
      </div>

      <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <label className={`text-sm font-semibold mb-4 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Tamanho
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onChange('size', 'half')}
            className={`p-6 border-2 rounded-xl transition-all ${
              formData.size === 'half'
                ? darkMode ? 'border-blue-500 bg-blue-950' : 'border-blue-600 bg-blue-50'
                : darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Half (415px)</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tamanho padrão</div>
          </button>
          <button
            onClick={() => onChange('size', 'full')}
            className={`p-6 border-2 rounded-xl transition-all ${
              formData.size === 'full'
                ? darkMode ? 'border-blue-500 bg-blue-950' : 'border-blue-600 bg-blue-50'
                : darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Full (830px)</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Largura completa</div>
          </button>
        </div>
      </div>

      <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <label className={`text-sm font-semibold mb-4 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Estilo
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onChange('style', 'default')}
            className={`p-6 border-2 rounded-xl transition-all ${
              formData.style === 'default'
                ? darkMode ? 'border-blue-500 bg-blue-950' : 'border-blue-600 bg-blue-50'
                : darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Default</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Visual moderno</div>
          </button>
          <button
            onClick={() => onChange('style', 'terminal')}
            className={`p-6 border-2 rounded-xl transition-all ${
              formData.style === 'terminal'
                ? darkMode ? 'border-blue-500 bg-blue-950' : 'border-blue-600 bg-blue-50'
                : darkMode ? 'border-gray-800 hover:border-gray-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Terminal</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Estilo retro</div>
          </button>
        </div>
      </div>

      <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <label className={`text-sm font-semibold mb-4 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Cor Primária
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={formData.primaryColor}
            onChange={(e) => onChange('primaryColor', e.target.value)}
            className="w-20 h-12 rounded-lg border cursor-pointer"
          />
          <input
            type="text"
            value={formData.primaryColor}
            onChange={(e) => onChange('primaryColor', e.target.value)}
            className={`flex-1 px-4 py-3 border rounded-lg font-mono ${darkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>

      <div className={`rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <button
          onClick={() => setShowCustomCSS(!showCustomCSS)}
          className="w-full p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Code className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <div className="text-left">
              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CSS Customizado</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Adicione estilos personalizados</div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${showCustomCSS ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        
        {showCustomCSS && (
          <div className="px-6 pb-6">
            <textarea
              value={formData.customCSS || ''}
              onChange={(e) => onChange('customCSS', e.target.value)}
              placeholder="/* Seu CSS aqui */"
              rows={10}
              className={`w-full px-4 py-3 border rounded-lg font-mono text-sm ${darkMode ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-300 placeholder-gray-400'}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Step3Plugins = ({ activePlugins, onAddPlugin, onRemovePlugin, darkMode }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPlugins, setExpandedPlugins] = useState<Record<string, boolean>>({});

  const filteredAvailable = availablePlugins.filter((p: Plugin) => 
    !activePlugins.find((ap: Plugin) => ap.id === p.id) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePlugin = (pluginId: string) => {
    setExpandedPlugins(prev => ({ ...prev, [pluginId]: !prev[pluginId] }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Configurar Plugins</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Adicione e configure os plugins que deseja exibir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Plugins */}
        <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Disponíveis</h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAvailable.map((plugin) => {
              const Icon = plugin.icon;
              return (
                <button
                  key={plugin.id}
                  onClick={() => onAddPlugin(plugin)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`w-8 h-8 ${plugin.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plugin.name}</span>
                  <Plus className={`w-4 h-4 ml-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Plugins */}
        <div className={`md:col-span-2 rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Plugins Ativos ({activePlugins.length})
          </h3>

          {activePlugins.length === 0 ? (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhum plugin ativo</p>
              <p className="text-xs mt-1">Adicione plugins da lista ao lado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePlugins.map((plugin: Plugin, index: number) => {
                const Icon = plugin.icon;
                const isExpanded = expandedPlugins[plugin.id];
                const sections = pluginSections[plugin.id] || [];
                
                return (
                  <div
                    key={plugin.id}
                    className={`rounded-lg border transition-all ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className={`w-5 h-5 cursor-move ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <div className={`w-10 h-10 ${plugin.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plugin.name}</div>
                          <input
                            type="text"
                            value={plugin.username || ''}
                            placeholder="Username"
                            className={`mt-1 px-2 py-1 text-xs rounded border w-full ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}
                          />
                        </div>
                        <button
                          onClick={() => togglePlugin(plugin.id)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-200'}`}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => onRemovePlugin(plugin.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-950' : 'text-red-600 hover:bg-red-50'}`}
                        >
                          Remover
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            SECTIONS ({plugin.selectedSections?.length || 0})
                          </div>
                          {sections.map((section: PluginSection) => (
                            <div
                              key={section.id}
                              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${darkMode ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-white'}`}
                            >
                              <GripVertical className={`w-4 h-4 cursor-move ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                              <input
                                type="checkbox"
                                checked={plugin.selectedSections?.includes(section.id)}
                                className="w-4 h-4 rounded"
                              />
                              <span className={`text-sm flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{section.label}</span>
                              {section.hasConfig && (
                                <button
                                  className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                  title="Configurar section"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Step4Preview = ({ formData, darkMode }: any) => {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preview Final</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Sua imagem está pronta! Copie o código para usar.
        </p>
      </div>

      <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Como usar</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Markdown (GitHub README)
            </label>
            <code className={`block px-4 py-3 rounded-lg text-sm font-mono ${darkMode ? 'bg-gray-950 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              ![WeebProfile](https://weebprofile.com/api/{formData.slug || 'seu-slug'}.svg)
            </code>
          </div>
          <div>
            <label className={`text-sm font-medium block mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              HTML
            </label>
            <code className={`block px-4 py-3 rounded-lg text-sm font-mono ${darkMode ? 'bg-gray-950 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              &lt;img src="https://weebprofile.com/api/{formData.slug || 'seu-slug'}.svg" /&gt;
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Footer
const NavigationFooter = ({ currentStep, totalSteps, onPrevious, onNext, onSave, darkMode }: any) => {
  return (
    <div className={`border-t px-8 py-4 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/25"
          >
            <Save className="w-4 h-4" />
            Criar Imagem
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Main App Component
const WeebProfileApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    size: 'half',
    style: 'default',
    primaryColor: '#1e30b8',
    customCSS: ''
  });

  const [activePlugins, setActivePlugins] = useState([
    { 
      id: 'github', 
      name: 'GitHub', 
      icon: Github, 
      color: 'bg-gray-900',
      username: 'octocat',
      selectedSections: ['profile', 'activity']
    }
  ]);

  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && !formData.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleAddPlugin = (plugin: Plugin) => {
    setActivePlugins(prev => [...prev, { ...plugin, username: '', selectedSections: [] }]);
  };

  const handleRemovePlugin = (pluginId: string) => {
    setActivePlugins(prev => prev.filter(p => p.id !== pluginId));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = () => {
    alert('Imagem criada com sucesso!');
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <TopNavBar 
        currentStep={currentStep}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {currentStep === 1 && <Step1Basic formData={formData} onChange={handleFormChange} darkMode={darkMode} />}
            {currentStep === 2 && <Step2Style formData={formData} onChange={handleFormChange} darkMode={darkMode} />}
            {currentStep === 3 && (
              <Step3Plugins 
                activePlugins={activePlugins}
                onAddPlugin={handleAddPlugin}
                onRemovePlugin={handleRemovePlugin}
                darkMode={darkMode}
              />
            )}
            {currentStep === 4 && <Step4Preview formData={formData} darkMode={darkMode} />}
          </div>
        </main>

        {/* Preview Panel */}
        <PreviewPanel 
          formData={formData}
          activePlugins={activePlugins}
          darkMode={darkMode}
          isVisible={showPreview}
        />
      </div>

      {/* Navigation Footer */}
      <NavigationFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSave={handleSave}
        darkMode={darkMode}
      />
    </div>
  );
};

export default WeebProfileApp;