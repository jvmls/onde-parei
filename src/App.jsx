import { useState, useEffect } from 'react'
import { Plus, Trash2, BookOpen, Tv, Search, X, Moon, Sun, GripVertical, MonitorPlay, LogOut, User } from 'lucide-react'

// --- BIBLIOTECAS DE ARRASTAR E SOLTAR ---
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- BANCO DE DADOS DE EXEMPLO (MOCK) ---
// Se o usuário entrar com esses nomes, os dados virão pré-carregados!
const DADOS_EXEMPLO = {
  'otaku': [
    { id: 1, nome: 'One Piece', tipo: 'serie', progresso: 1090 },
    { id: 2, nome: 'Jujutsu Kaisen', tipo: 'serie', progresso: 45 },
    { id: 3, nome: 'Solo Leveling', tipo: 'livro', progresso: 120 },
    { id: 4, nome: 'Frieren e a Jornada', tipo: 'serie', progresso: 28 },
  ],
  'leitor': [
    { id: 5, nome: 'O Senhor dos Anéis', tipo: 'livro', progresso: 450 },
    { id: 6, nome: 'Harry Potter 1', tipo: 'livro', progresso: 220 },
    { id: 7, nome: 'O Código Da Vinci', tipo: 'livro', progresso: 100 },
    { id: 8, nome: 'Sherlock Holmes (Série)', tipo: 'serie', progresso: 12 },
  ]
}

// --- COMPONENTE ITEM (SORTABLE) ---
function SortableItem({ item, idDestacado, onDelete, onUpdateProgresso, isDragEnabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      id={`item-${item.id}`}
      className={`
        relative bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border transition-all duration-300 group
        ${idDestacado === item.id 
          ? 'border-yellow-400 ring-2 ring-yellow-400 scale-[1.02] z-10' 
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
      `}
    >
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${item.tipo === 'serie' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

      {isDragEnabled && (
        <div {...attributes} {...listeners} className="absolute right-2 top-2 p-1.5 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing touch-none">
          <GripVertical size={16} />
        </div>
      )}

      <div className="pl-3 flex flex-col gap-3">
        <div className="flex justify-between items-start pr-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{item.nome}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {item.tipo === 'serie' ? <Tv size={12} className="text-purple-500"/> : <BookOpen size={12} className="text-blue-500"/>}
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.tipo === 'serie' ? 'Episódio' : 'Página'}</span>
            </div>
          </div>
          <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-500 dark:hover:text-red-400 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Trash2 size={16}/>
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button onClick={() => onUpdateProgresso(item.id, -1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-lg transition-colors">-</button>
          <div className="flex-1 relative">
            <input type="number" value={item.progresso} onChange={(e) => onUpdateProgresso(item.id, e.target.value, true)} className="w-full h-10 text-center font-bold text-xl bg-transparent text-slate-900 dark:text-white focus:outline-none border-b-2 border-transparent focus:border-purple-500 transition-all" />
          </div>
          <button onClick={() => onUpdateProgresso(item.id, 1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 font-bold text-lg shadow-lg shadow-purple-900/10 transition-all">+</button>
        </div>
      </div>
    </div>
  );
}

// --- TELA DE LOGIN ---
function LoginScreen({ onLogin, tema, alternarTema }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) onLogin(username)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
      
      {/* Botão de Tema no Login */}
      <button onClick={alternarTema} className="absolute top-6 right-6 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
        {tema === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 mb-2 shadow-lg">
            <span className="text-2xl font-black">OP?</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bem-vindo de volta</h1>
          <p className="text-slate-500 text-sm">Digite seu usuário para acessar seus hobbies.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input 
              type="text" 
              placeholder="Seu nome de usuário..." 
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full h-12 bg-slate-900 dark:bg-purple-600 text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg">
            Entrar
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Ou teste com exemplos</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onLogin('otaku')} className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            Personagem Otaku 📺
          </button>
          <button onClick={() => onLogin('leitor')} className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            Personagem Leitor 📖
          </button>
        </div>
      </div>
    </div>
  )
}

// --- APP PRINCIPAL ---
function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('usuario_ativo') || null)
  const [items, setItems] = useState([]) // Começa vazio, carrega ao logar
  
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'light')
  const [novoNome, setNovoNome] = useState('')
  const [novoTipo, setNovoTipo] = useState('serie')
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [idDestacado, setIdDestacado] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- EFEITOS ---
  
  // 1. Carrega dados quando o usuário muda (LOGIN)
  useEffect(() => {
    if (usuario) {
      const chaveStorage = `hobbies_${usuario}`
      const dadosSalvos = localStorage.getItem(chaveStorage)

      if (dadosSalvos) {
        setItems(JSON.parse(dadosSalvos))
      } else {
        // Se não tem dados salvos, verifica se é um usuário de exemplo
        if (DADOS_EXEMPLO[usuario]) {
          setItems(DADOS_EXEMPLO[usuario])
        } else {
          setItems([]) // Usuário novo começa vazio
        }
      }
      localStorage.setItem('usuario_ativo', usuario)
    }
  }, [usuario])

  // 2. Salva dados quando os itens mudam (PERSISTÊNCIA)
  useEffect(() => {
    if (usuario && items) {
      localStorage.setItem(`hobbies_${usuario}`, JSON.stringify(items))
    }
  }, [items, usuario])

  // 3. Tema
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  // --- FUNÇÕES DE LOGICA ---
  const handleLogin = (nomeUsuario) => {
    setUsuario(nomeUsuario.toLowerCase()) // Normaliza para minúsculo
  }

  const handleLogout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario_ativo')
    setItems([])
  }

  const alternarTema = () => {
    setTema(anterior => anterior === 'light' ? 'dark' : 'light')
  }

  // --- LÓGICA DE CRUD E ARRASTAR (IGUAL ANTES) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((itemsAtuais) => {
      const oldIndex = itemsAtuais.findIndex((item) => item.id === active.id);
      const newIndex = itemsAtuais.findIndex((item) => item.id === over.id);
      return arrayMove(itemsAtuais, oldIndex, newIndex);
    });
  };

  const adicionarItem = (e) => {
    e.preventDefault()
    if (!novoNome.trim()) return
    const itemExistente = items.find(item => item.nome.toLowerCase() === novoNome.toLowerCase())
    if (itemExistente) {
      // Lógica de destacar (simplificada aqui)
      setBusca('')
      setFiltro(itemExistente.tipo)
      setTimeout(() => {
        const el = document.getElementById(`item-${itemExistente.id}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setIdDestacado(itemExistente.id)
        setTimeout(() => setIdDestacado(null), 2000)
      }, 100)
      setNovoNome('')
      return
    }
    const novoItem = { id: Date.now(), nome: novoNome, tipo: novoTipo, progresso: 0 }
    setItems([novoItem, ...items])
    setNovoNome('')
    setFiltro(novoTipo)
    setBusca('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deletarItem = (id) => setItems(items.filter(item => item.id !== id))
  
  const atualizarProgresso = (id, valor, isInputDireto = false) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const novoProgresso = isInputDireto ? Number(valor) : item.progresso + valor
        return { ...item, progresso: Math.max(0, novoProgresso) }
      }
      return item
    }))
  }

  const itensFiltrados = items.filter(item => {
    const passaFiltroTipo = filtro === 'todos' ? true : item.tipo === filtro
    const passaBusca = item.nome.toLowerCase().includes(busca.toLowerCase())
    return passaFiltroTipo && passaBusca
  })

  const isDragEnabled = !busca && filtro === 'todos';

  // --- RENDERIZAÇÃO CONDICIONAL ---
  if (!usuario) {
    return <LoginScreen onLogin={handleLogin} tema={tema} alternarTema={alternarTema} />
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded text-sm font-black">OP?</span> 
              <span className="truncate max-w-[150px]">Olá, {usuario}</span>
            </h1>
            <div className="flex gap-2">
              <button onClick={alternarTema} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 transition-all">
                {tema === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button onClick={handleLogout} className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-all" title="Sair">
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={adicionarItem} className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
            <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm">
              <button type="button" onClick={() => setNovoTipo('serie')} className={`p-2 rounded-lg transition-all ${novoTipo === 'serie' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}> <Tv size={20} /> </button>
              <button type="button" onClick={() => setNovoTipo('livro')} className={`p-2 rounded-lg transition-all ${novoTipo === 'livro' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}> <BookOpen size={20} /> </button>
            </div>
            <input type="text" placeholder={novoTipo === 'serie' ? "Nome da nova série..." : "Nome do novo livro..."} className="flex-1 bg-transparent px-2 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
            <button type="submit" disabled={!novoNome} className="px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"> <Plus size={18} strokeWidth={3} /> <span className="hidden sm:inline">Add</span> </button>
          </form>

          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500" size={16} />
              <input type="text" placeholder="Pesquisar..." className="w-full bg-slate-100 dark:bg-slate-800 h-9 rounded-lg pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 dark:text-white transition-all" value={busca} onChange={(e) => setBusca(e.target.value)} />
              {busca && ( <button onClick={() => setBusca('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"> <X size={14} /> </button> )}
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {['todos', 'serie', 'livro'].map((tipo) => (
                <button key={tipo} onClick={() => setFiltro(tipo)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all capitalize ${filtro === tipo ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}> {tipo} </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-4">
        {itensFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 opacity-60">
            {busca ? <Search size={48} className="mb-2"/> : <MonitorPlay size={48} className="mb-2"/>}
            <p className="font-medium">{busca ? 'Nenhum resultado.' : 'Comece adicionando algo acima!'}</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itensFiltrados.map(item => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {itensFiltrados.map(item => (
                <SortableItem 
                  key={item.id} item={item} idDestacado={idDestacado} 
                  onDelete={deletarItem} onUpdateProgresso={atualizarProgresso} isDragEnabled={isDragEnabled} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

    </div>
  )
}

export default App