import { useState, useEffect, useRef, useCallback } from "react";

/* ── DATA ─────────────────────────────────────────────────────────────────── */
const TIERS = [
  {
    id:"t1", num:"01", label:"TIER ONE", title:"High Priority",
    color:"#ff3b30", glow:"rgba(255,59,48,0.4)", dim:"rgba(255,59,48,0.07)",
    topics:[
      {id:"seg-tree",  name:"Segment Tree",          link:"https://cp-algorithms.com/data_structures/segment_tree.html",         subs:["Build, Query, Update","Point update range query","Range update point query"]},
      {id:"bit",       name:"Fenwick Tree / BIT",     link:"https://cp-algorithms.com/data_structures/fenwick.html",              subs:["Point update prefix sum","Range update range query","2D BIT"]},
      {id:"mono",      name:"Monotonic Stack + Queue",link:"https://cp-algorithms.com/data_structures/stack_queue_modification.html",subs:["Next Greater Element","Previous Greater/Smaller","Largest rectangle in histogram","Sliding window using stack","Monotonic Queue DP optimization"]},
      {id:"greedy",    name:"Greedy",                 link:"https://cp-algorithms.com/greedy/index.html",                         subs:["Activity Selection","Interval Scheduling / Merging","Jump Game variants","Task Scheduler","Greedy + Sorting combos","Greedy + DS (heap/seg tree)","Exchange argument proofs"]},
      {id:"bitmask",   name:"Bitmask DP",             link:"https://cp-algorithms.com/algebra/all-submasks.html",                 subs:["Subset enumeration","TSP / Hamiltonian path DP","Bitmask over states","Backtracking + Bitmask"]},
      {id:"bipartite", name:"Bipartite Check",        link:"https://cp-algorithms.com/graph/bipartite-check.html",               subs:["2-coloring via BFS","2-coloring via DFS","Odd cycle detection"]},
      {id:"mst",       name:"MST",                    link:"https://cp-algorithms.com/graph/mst_kruskal.html",                   subs:["Kruskal (DSU based)","Prim's algorithm","MST on dense graphs"]},
      {id:"heaps",     name:"Heaps — Advanced",       link:"https://cp-algorithms.com/graph/dijkstra.html",                     subs:["Two heaps pattern (median finder)","Lazy deletion in heap","DSU + Heap combo","Heap optimized Dijkstra"]},
      {id:"lru",       name:"LRU / LFU Cache",        link:"https://cp-algorithms.com/",                                        subs:["LRU with HashMap + DLL","LFU with frequency buckets","O(1) get and put"]},
      {id:"trie",      name:"Trie",                   link:"https://cp-algorithms.com/string/aho_corasick.html",                 subs:["Insert, Search, Prefix","Word break via Trie","Trie on bits (max XOR)","XOR Basis / Linear Basis"]},
    ]
  },
  {
    id:"t2", num:"02", label:"TIER TWO", title:"Do These Next",
    color:"#ff9f0a", glow:"rgba(255,159,10,0.4)", dim:"rgba(255,159,10,0.07)",
    topics:[
      {id:"lazy-seg",   name:"Segment Tree — Lazy Prop",   link:"https://cp-algorithms.com/data_structures/segment_tree.html",    subs:["Range assign + range sum","Range add + range min/max","Composing lazy tags"]},
      {id:"euler-tour", name:"Euler Tour / Tree Flatten",  link:"https://cp-algorithms.com/graph/euler_path.html",               subs:["In/out time DFS","Flattening tree to array","Range queries on subtree","LCA using Euler Tour + RMQ"]},
      {id:"tree-dp",    name:"Tree DP",                    link:"https://cp-algorithms.com/graph/tree-dp.html",                  subs:["Basic subtree DP","Re-rooting technique","DP on paths","Diameter / max path sum"]},
      {id:"kmp-z",      name:"KMP + Z-algorithm",          link:"https://cp-algorithms.com/string/prefix-function.html",         subs:["Failure function (KMP)","Pattern search via KMP","Z-array construction","Pattern search via Z-algo","Period of a string"]},
      {id:"str-hash",   name:"String Hashing + Rabin-Karp",link:"https://cp-algorithms.com/string/string-hashing.html",         subs:["Polynomial rolling hash","Double hashing (anti-collision)","Rabin-Karp multi-pattern","Substring comparison in O(1)"]},
      {id:"digit-dp",   name:"Digit DP",                   link:"https://cp-algorithms.com/dynamic_programming/digit-dp.html",   subs:["Count numbers in [L,R] with property","Tight constraint handling","Digit DP with sum/count states"]},
      {id:"interval-dp",name:"Interval DP (MCM)",          link:"https://cp-algorithms.com/dynamic_programming/index.html",      subs:["Matrix Chain Multiplication","Burst Balloons","Palindrome partitioning","Optimal BST"]},
      {id:"sweep",      name:"Sweep Line",                 link:"https://cp-algorithms.com/geometry/intersecting_segments.html", subs:["Merge intervals","Insert intervals","Meeting rooms variants","Employee free time","Area of union of rectangles"]},
      {id:"bs-adv",     name:"Binary Search — Advanced",   link:"https://cp-algorithms.com/num_methods/binary_search.html",     subs:["BS on answer","BS on floating point","BS + Greedy","BS on complex predicates","BS on Segment Tree / BIT"]},
      {id:"scc",        name:"SCC",                        link:"https://cp-algorithms.com/graph/strongly-connected-components.html",subs:["Kosaraju's algorithm","Tarjan's algorithm","Condensation DAG","2-SAT"]},
      {id:"mat-exp",    name:"Matrix Exponentiation",      link:"https://cp-algorithms.com/algebra/matrix-exp.html",            subs:["Matrix multiply in O(n^3)","Fast exponentiation for matrices","Linear recurrence to matrix form","Fibonacci in O(log n)"]},
      {id:"backtrack",  name:"Backtracking — Advanced",    link:"https://cp-algorithms.com/",                                   subs:["Palindrome partitioning","Letter combinations","Backtracking + Pruning","Backtracking + Bitmask","Hamiltonian path on graphs"]},
    ]
  },
  {
    id:"t3", num:"03", label:"TIER THREE", title:"After Tier 1 + 2",
    color:"#ffd60a", glow:"rgba(255,214,10,0.4)", dim:"rgba(255,214,10,0.07)",
    topics:[
      {id:"dp-str",    name:"DP on Strings",            link:"https://cp-algorithms.com/string/edit-distance.html",             subs:["LCS","Edit Distance","Longest Palindromic Subsequence","Shortest Common Supersequence","Wildcard / Regex matching"]},
      {id:"dp-graph",  name:"DP on Graphs",             link:"https://cp-algorithms.com/dynamic_programming/index.html",       subs:["DP on DAG","Shortest path DP","Counting paths in DAG","DP on SCC condensation"]},
      {id:"manacher",  name:"Manacher's Algorithm",     link:"https://cp-algorithms.com/string/manacher.html",                 subs:["Palindrome radius array","Longest palindromic substring","Count palindromic substrings"]},
      {id:"aho",       name:"Aho-Corasick",             link:"https://cp-algorithms.com/string/aho_corasick.html",             subs:["Trie + failure links","Multi-pattern search","Aho-Corasick + DP"]},
      {id:"centroid",  name:"Centroid Decomposition",   link:"https://cp-algorithms.com/graph/centroid-decomposition.html",    subs:["Finding centroid","Centroid tree construction","Distance queries on tree"]},
      {id:"hld",       name:"Heavy Light Decomposition",link:"https://cp-algorithms.com/graph/hld.html",                      subs:["Chain decomposition","Path queries on tree","HLD + Segment Tree"]},
      {id:"dsu-tree",  name:"DSU on Tree",              link:"https://cp-algorithms.com/graph/dsu_on_tree.html",               subs:["Small to large merging","Subtree distinct count","DSU on tree for offline queries"]},
      {id:"suffix",    name:"Suffix Array / Automaton", link:"https://cp-algorithms.com/string/suffix-array.html",            subs:["Suffix array construction O(n log n)","LCP array","Suffix automaton construction","Distinct substrings count"]},
      {id:"cht",       name:"CHT + D&C DP Opt",         link:"https://cp-algorithms.com/dynamic_programming/convex_hull_trick.html",subs:["Convex Hull Trick (CHT)","Li Chao tree","Divide and Conquer DP","Knuth's optimization"]},
      {id:"flow",      name:"Network Flow",             link:"https://cp-algorithms.com/graph/edmonds_karp.html",             subs:["Ford-Fulkerson","Edmonds-Karp (BFS based)","Dinic's algorithm","Min cut = Max flow","Bipartite matching via flow"]},
      {id:"persist",   name:"Persistent Segment Tree",  link:"https://cp-algorithms.com/data_structures/persistent-segment-tree.html",subs:["Version control on seg tree","Kth smallest in range","Offline range queries"]},
      {id:"comb",      name:"Combinatorics + NT",       link:"https://cp-algorithms.com/algebra/module-inverse.html",         subs:["Modular inverse (Fermat + ext GCD)","nCr % mod","Lucas theorem","Euler's Totient Function","CRT","Sieve of Eratosthenes","Prime factorization"]},
      {id:"xor",       name:"XOR / Linear Basis",       link:"https://cp-algorithms.com/algebra/linear-basis.html",           subs:["Gaussian elimination over GF(2)","Max XOR subset","Linear independence of bits"]},
    ]
  },
  {
    id:"t4", num:"04", label:"TIER FOUR", title:"Rare / CF Territory",
    color:"#48484a", glow:"rgba(72,72,74,0.5)", dim:"rgba(72,72,74,0.07)",
    topics:[
      {id:"rand",      name:"Randomized Algorithms",   link:"https://cp-algorithms.com/",                                    subs:["QuickSelect (Kth element)","Reservoir Sampling","Fisher-Yates Shuffle","Miller-Rabin Primality Test","Karger's Min Cut","Bloom Filters"]},
      {id:"game",      name:"Game Theory",             link:"https://cp-algorithms.com/game_theory/sprague-grundy-nim.html",subs:["Nim game","Grundy numbers","Sprague-Grundy theorem","Game DP","Minimax","Alpha-Beta Pruning","Staircase Nim","Misere games"]},
      {id:"geom",      name:"Geometry",                link:"https://cp-algorithms.com/geometry/convex-hull.html",          subs:["Convex Hull (Graham / Monotone chain)","Line intersection","Point in polygon","Rotating calipers"]},
      {id:"fft",       name:"NTT / FFT",               link:"https://cp-algorithms.com/algebra/fft.html",                  subs:["DFT / IDFT","FFT for polynomial multiply","NTT (mod-friendly FFT)","Convolution problems"]},
      {id:"lct",       name:"Link Cut Trees",          link:"https://cp-algorithms.com/graph/link_cut_trees.html",         subs:["Access / splay operations","Link and cut edges","Dynamic connectivity"]},
      {id:"sos",       name:"SOS DP",                  link:"https://cp-algorithms.com/algebra/all-submasks.html",         subs:["Subset sum DP over bitmasks","Superset sum DP","OR / AND convolution"]},
      {id:"euler-p",   name:"Eulerian Path / Circuit", link:"https://cp-algorithms.com/graph/euler_path.html",            subs:["Hierholzer's algorithm","Directed vs undirected Eulerian","Existence conditions"]},
      {id:"morris",    name:"Morris Traversal",        link:"https://cp-algorithms.com/",                                 subs:["Inorder without stack/recursion","Preorder Morris traversal","O(1) space tree traversal"]},
    ]
  }
];

const KEY = "dsa-v3";

/* ── HOOKS ────────────────────────────────────────────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useInView(ref, threshold = 0.1) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, threshold]);
  return vis;
}

function useLocalParallax(multiplier = 0.12) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * multiplier);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [multiplier]);
  return [ref, offset];
}

/* ── GRAIN ───────────────────────────────────────────────────────────────── */
const Grain = () => (
  <div style={{ position:"fixed", inset:0, zIndex:9000, pointerEvents:"none", opacity:0.04 }}>
    <svg width="100%" height="100%">
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#g)"/>
    </svg>
  </div>
);

/* ── TOP PROGRESS STRIPE ─────────────────────────────────────────────────── */
const TopBar = ({ pct }) => (
  <div style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:8000, background:"rgba(0,0,0,0.6)" }}>
    <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#ff3b30,#ff9f0a,#ffd60a)", boxShadow:"0 0 10px rgba(255,159,10,0.9)", transition:"width 0.7s cubic-bezier(.4,0,.2,1)" }}/>
  </div>
);

/* ── FLOATING STATUS ─────────────────────────────────────────────────────── */
const FloatStatus = ({ pct, done, total, scrollY }) => {
  const show = scrollY > 500;
  return (
    <div style={{ position:"fixed", top:20, right:24, zIndex:7000, opacity:show?1:0, transform:show?"translateY(0)":"translateY(-12px)", transition:"all 0.5s cubic-bezier(.4,0,.2,1)", pointerEvents:show?"auto":"none" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(10,10,10,0.85)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:99, padding:"8px 18px" }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:`conic-gradient(#ff3b30 ${pct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`, boxShadow:"0 0 6px rgba(255,159,10,0.7)" }}/>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"rgba(255,255,255,0.55)", letterSpacing:"0.06em" }}>{pct}<span style={{color:"rgba(255,255,255,0.2)"}}>%</span></span>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.2)" }}>{done}/{total}</span>
      </div>
    </div>
  );
};

/* ── FILTER PILL ─────────────────────────────────────────────────────────── */
const FilterPill = ({ filter, setFilter, scrollY }) => {
  const show = scrollY > 400;
  return (
    <div style={{ position:"fixed", bottom:32, left:"50%", zIndex:7000, transform:`translateX(-50%) translateY(${show?0:100}px)`, transition:"transform 0.5s cubic-bezier(.4,0,.2,1)", display:"flex", gap:2, background:"rgba(10,10,10,0.85)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:99, padding:4 }}>
      {["all","pending","done"].map(f => (
        <button key={f} onClick={() => setFilter(f)} style={{ padding:"7px 20px", borderRadius:99, fontSize:10, cursor:"pointer", border:"none", fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.25s", background:filter===f?"#fff":"transparent", color:filter===f?"#000":"rgba(255,255,255,0.28)", fontWeight:filter===f?600:400 }}>
          {f}
        </button>
      ))}
    </div>
  );
};

/* ── HERO ─────────────────────────────────────────────────────────────────── */
const Hero = ({ pct, done, total, scrollY }) => {
  const fade = Math.max(0, 1 - scrollY / 650);
  const lift = scrollY * 0.45;
  const slowLift = scrollY * 0.18;

  return (
    <section style={{ position:"relative", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>

      {/* Deep space orbs — slowest layer */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"15%", left:"5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,59,48,0.1) 0%,transparent 65%)", transform:`translateY(${scrollY*0.1}px)`, filter:"blur(80px)" }}/>
        <div style={{ position:"absolute", bottom:"10%", right:"8%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,159,10,0.07) 0%,transparent 65%)", transform:`translateY(${-scrollY*0.08}px)`, filter:"blur(100px)" }}/>
        <div style={{ position:"absolute", top:"40%", left:"40%", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle,rgba(10,120,255,0.04) 0%,transparent 65%)", transform:`translate(-50%,-50%) translateY(${scrollY*0.05}px)`, filter:"blur(120px)" }}/>
      </div>

      {/* Ghost text — medium layer */}
      <div style={{ position:"absolute", fontSize:"clamp(80px,18vw,260px)", fontFamily:"'Bebas Neue',sans-serif", color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,0.04)", letterSpacing:"0.04em", userSelect:"none", transform:`translateY(${slowLift}px)`, whiteSpace:"nowrap", pointerEvents:"none" }}>
        ALGORITHM
      </div>

      {/* Main content — fastest layer */}
      <div style={{ position:"relative", textAlign:"center", transform:`translateY(${lift}px)`, opacity:fade }}>

        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.3em", color:"rgba(255,255,255,0.25)", marginBottom:28, textTransform:"uppercase" }}>
          KNIGHT ON LC  ·  SPECIALIST ON CF  ·  BATTLE PLAN ACTIVE
        </div>

        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontWeight:400, margin:0, lineHeight:0.88, letterSpacing:"0.01em", fontSize:"clamp(64px,12vw,170px)" }}>
          <span style={{ display:"block", color:"#fff" }}>FAANG</span>
          <span style={{ display:"block", background:"linear-gradient(90deg,#ff3b30 0%,#ff9f0a 50%,#ffd60a 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>PREP</span>
          <span style={{ display:"block", color:"rgba(255,255,255,0.18)" }}>TRACKER</span>
        </h1>

        {/* Arc progress ring */}
        <div style={{ marginTop:52, display:"inline-flex", alignItems:"center", gap:32, position:"relative" }}>
          <svg width={130} height={130} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff3b30"/>
                <stop offset="50%" stopColor="#ff9f0a"/>
                <stop offset="100%" stopColor="#ffd60a"/>
              </linearGradient>
            </defs>
            <circle cx={65} cy={65} r={56} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5}/>
            <circle cx={65} cy={65} r={56} fill="none" stroke="url(#ringGrad)" strokeWidth={5} strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*56}`}
              strokeDashoffset={`${2*Math.PI*56*(1-pct/100)}`}
              style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)", filter:"drop-shadow(0 0 8px rgba(255,159,10,0.6))" }}/>
          </svg>
          <div style={{ position:"absolute", top:"50%", left:65, transform:"translate(-50%,-50%)", textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, background:"linear-gradient(135deg,#ff9f0a,#ffd60a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{pct}%</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.2)", letterSpacing:"0.08em", marginTop:2 }}>{done}/{total}</div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ marginTop:56, display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:0.4 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>scroll</span>
          <div style={{ width:1, height:36, background:"linear-gradient(to bottom,rgba(255,255,255,0.4),transparent)", animation:"pulse 2s ease-in-out infinite" }}/>
        </div>
      </div>
    </section>
  );
};

/* ── TIER SECTION ─────────────────────────────────────────────────────────── */
const TierSection = ({ tier, done, onToggleSub, onToggleAll, filter }) => {
  const [sectionRef, parallaxOffset] = useLocalParallax(0.12);
  const headerRef = useRef(null);
  const headerVis = useInView(headerRef, 0.1);
  const [openTopics, setOpenTopics] = useState({});

  const allSubs = tier.topics.flatMap(t => t.subs.map((_,i) => `${t.id}-${i}`));
  const tierDone = allSubs.filter(id => done[id]).length;
  const tierPct = Math.round(tierDone / allSubs.length * 100);

  const tProg = t => {
    const d = t.subs.filter((_,i) => done[`${t.id}-${i}`]).length;
    return { d, total: t.subs.length, pct: Math.round(d/t.subs.length*100) };
  };

  const filtered = tier.topics.filter(t => {
    if (filter === "all") return true;
    const { d, total } = tProg(t);
    return filter === "done" ? d === total : d < total;
  });

  if (filtered.length === 0) return null;

  return (
    <section ref={sectionRef} style={{ position:"relative", padding:"140px 0 80px", overflow:"hidden" }}>

      {/* Section ambient glow */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 55% 40% at 50% 50%,${tier.dim} 0%,transparent 100%)`, pointerEvents:"none" }}/>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 32px" }}>

        {/* Section header */}
        <div ref={headerRef} style={{ display:"flex", alignItems:"flex-end", gap:0, marginBottom:72, position:"relative" }}>

          {/* Giant parallax number */}
          <div style={{
            position:"absolute", left:-20, bottom:-10,
            fontSize:"clamp(120px,16vw,220px)", fontFamily:"'Bebas Neue',sans-serif", fontWeight:400,
            color:"transparent", WebkitTextStroke:`1px ${tier.color}`, opacity:0.12,
            lineHeight:1, userSelect:"none",
            transform:`translateY(${-parallaxOffset * 1.4}px)`,
            transition:"transform 0.05s linear",
          }}>{tier.num}</div>

          {/* Text block — different speed */}
          <div style={{ paddingLeft:"clamp(60px,10vw,180px)", transform:`translateY(${-parallaxOffset * 0.6}px)`, transition:"transform 0.05s linear" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.3em", color:tier.color, marginBottom:10, opacity:headerVis?1:0, transform:headerVis?"none":"translateX(-16px)", transition:"all 0.7s 0.1s ease" }}>
              {tier.label}
            </div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontWeight:400, fontSize:"clamp(40px,6vw,88px)", color:"#fff", lineHeight:1, margin:0, letterSpacing:"0.01em", opacity:headerVis?1:0, transform:headerVis?"none":"translateY(12px)", transition:"all 0.8s 0.2s ease" }}>
              {tier.title}
            </h2>

            {/* Progress line */}
            <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:14, opacity:headerVis?1:0, transition:"opacity 0.7s 0.4s" }}>
              <div style={{ width:"clamp(120px,20vw,280px)", height:1, background:"rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${tierPct}%`, background:tier.color, boxShadow:`0 0 8px ${tier.color}`, transition:"width 1.2s 0.6s cubic-bezier(.4,0,.2,1)" }}/>
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:tier.color, opacity:0.8, letterSpacing:"0.05em" }}>{tierDone}/{allSubs.length}</span>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:1 }}>
          {filtered.map((topic, ti) => {
            const { d, total: tT, pct: tPct } = tProg(topic);
            const allDone = d === tT;
            const isOpen = openTopics[topic.id];
            return (
              <TopicCard key={topic.id} topic={topic} tier={tier} d={d} tT={tT} tPct={tPct} allDone={allDone} isOpen={isOpen} done={done}
                animDelay={ti * 0.04} headerVis={headerVis}
                onToggleOpen={() => setOpenTopics(o => ({...o, [topic.id]:!o[topic.id]}))}
                onToggleAll={() => onToggleAll(topic)}
                onToggleSub={onToggleSub}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ── TOPIC CARD ──────────────────────────────────────────────────────────── */
const TopicCard = ({ topic, tier, d, tT, tPct, allDone, isOpen, done, animDelay, headerVis, onToggleOpen, onToggleAll, onToggleSub }) => {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const vis = useInView(ref, 0.05);

  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:`opacity 0.55s ${animDelay + 0.25}s ease, transform 0.55s ${animDelay + 0.25}s ease` }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ background:hov?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.01)", border:`1px solid ${hov ? tier.color : "rgba(255,255,255,0.055)"}`, transition:"border-color 0.2s, background 0.2s, box-shadow 0.2s", boxShadow:hov?`inset 0 0 30px ${tier.glow}`:"none" }}
      >
        {/* Header row */}
        <div onClick={onToggleOpen} style={{ display:"flex", alignItems:"center", gap:12, padding:"15px 18px", cursor:"pointer" }}>

          {/* Expand box */}
          <div style={{ width:18, height:18, border:`1px solid ${allDone?"#30d158":tier.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:allDone?"rgba(48,209,88,0.1)":"transparent", transition:"all 0.2s" }}>
            {allDone
              ? <span style={{ color:"#30d158", fontSize:9, fontWeight:700 }}>✓</span>
              : <span style={{ color:tier.color, fontSize:7, display:"inline-block", transform:isOpen?"rotate(90deg)":"none", transition:"transform 0.25s" }}>▶</span>
            }
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:allDone?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.9)", textDecoration:allDone?"line-through":"none", textDecorationColor:"rgba(255,255,255,0.15)", letterSpacing:"0.01em" }}>
              {topic.name}
            </div>
            <div style={{ marginTop:7, height:1, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${tPct}%`, background:allDone?"#30d158":tier.color, transition:"width 0.4s", boxShadow:allDone?"0 0 6px rgba(48,209,88,0.5)":undefined }}/>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.18)" }}>{d}/{tT}</span>
            {/* mark all */}
            <div onClick={e=>{e.stopPropagation();onToggleAll();}} style={{ width:20, height:20, border:`1px solid ${allDone?"#30d158":"rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:allDone?"rgba(48,209,88,0.1)":"transparent", transition:"all 0.2s", fontSize:9, color:allDone?"#30d158":"rgba(255,255,255,0.2)" }}>
              {allDone?"✓":"○"}
            </div>
            {/* cp link */}
            <a href={topic.link} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              style={{ fontFamily:"'DM Mono',monospace", fontSize:8, padding:"3px 8px", border:`1px solid ${tier.color}`, color:tier.color, textDecoration:"none", letterSpacing:"0.08em", opacity:0.5, whiteSpace:"nowrap", transition:"opacity 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="1"}
              onMouseLeave={e=>e.currentTarget.style.opacity="0.5"}
            >ALGO ↗</a>
          </div>
        </div>

        {/* Subtopics — animated expand */}
        <div style={{ overflow:"hidden", maxHeight:isOpen?800:0, transition:"max-height 0.45s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
            {topic.subs.map((sub, si) => {
              const subId = `${topic.id}-${si}`;
              const isDone = !!done[subId];
              return (
                <div key={subId} onClick={()=>onToggleSub(subId)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 18px 9px 48px", cursor:"pointer", borderTop:si>0?"1px solid rgba(255,255,255,0.025)":"none", transition:"background 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{ width:11, height:11, border:`1px solid ${isDone?"#30d158":"rgba(255,255,255,0.12)"}`, background:isDone?"rgba(48,209,88,0.15)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                    {isDone && <span style={{ color:"#30d158", fontSize:7, fontWeight:700 }}>✓</span>}
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:isDone?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.45)", textDecoration:isDone?"line-through":"none", textDecorationColor:"rgba(255,255,255,0.12)", letterSpacing:"0.01em" }}>
                    {sub}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── SECTION DIVIDER ─────────────────────────────────────────────────────── */
const Divider = ({ color }) => (
  <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 32px" }}>
    <div style={{ height:1, background:`linear-gradient(90deg,transparent 0%,${color} 40%,${color} 60%,transparent 100%)`, opacity:0.2 }}/>
  </div>
);

/* ── APP ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [done, setDone] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)||"{}"); } catch { return {}; } });
  const [filter, setFilter] = useState("all");
  const scrollY = useScrollY();

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch {} }, [done]);

  const toggleSub = useCallback(id => setDone(d => ({...d, [id]:!d[id]})), []);
  const toggleAll = useCallback(topic => {
    setDone(d => {
      const all = topic.subs.every((_,i) => d[`${topic.id}-${i}`]);
      const n = {...d};
      topic.subs.forEach((_,i) => { n[`${topic.id}-${i}`] = !all; });
      return n;
    });
  }, []);

  const allSubs = TIERS.flatMap(t => t.topics.flatMap(tp => tp.subs.map((_,i) => `${tp.id}-${i}`)));
  const totalDone = allSubs.filter(id => done[id]).length;
  const pct = Math.round(totalDone / allSubs.length * 100);

  return (
    <div style={{ background:"#050505", color:"#fff", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#050505; overflow-x:hidden; }
        ::-webkit-scrollbar { width:2px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scaleY(1)} 50%{opacity:0.9;transform:scaleY(1.3)} }
        ::selection { background:rgba(255,159,10,0.25); }
        button { cursor:pointer; }
      `}</style>

      <Grain />
      <TopBar pct={pct} />
      <FloatStatus pct={pct} done={totalDone} total={allSubs.length} scrollY={scrollY} />
      <FilterPill filter={filter} setFilter={setFilter} scrollY={scrollY} />

      <Hero pct={pct} done={totalDone} total={allSubs.length} scrollY={scrollY} />

      {TIERS.map((tier, i) => (
        <div key={tier.id}>
          <Divider color={tier.color} />
          <TierSection tier={tier} done={done} onToggleSub={toggleSub} onToggleAll={toggleAll} filter={filter} />
        </div>
      ))}

      {/* Footer */}
      <footer style={{ textAlign:"center", padding:"100px 32px 60px", borderTop:"1px solid rgba(255,255,255,0.03)" }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(48px,8vw,110px)", color:"rgba(255,255,255,0.02)", letterSpacing:"0.12em", userSelect:"none" }}>
          KEEP GRINDING
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.08)", letterSpacing:"0.2em", marginTop:12 }}>
          PROGRESS SAVED LOCALLY  ·  {totalDone}/{allSubs.length} DONE
        </div>
      </footer>
    </div>
  );
}