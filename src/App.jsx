import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const TIERS = [
  {
    id:"t1", num:"01", label:"Tier 1", title:"High Priority",
    accent:"#ef4444", track:"rgba(239,68,68,0.12)", soft:"rgba(239,68,68,0.06)",
    topics:[
      {id:"seg-tree",  name:"Segment Tree",           link:"https://cp-algorithms.com/data_structures/segment_tree.html",            subs:["Build, Query, Update","Point update range query","Range update point query"]},
      {id:"bit",       name:"Fenwick Tree / BIT",      link:"https://cp-algorithms.com/data_structures/fenwick.html",                 subs:["Point update prefix sum","Range update range query","2D BIT"]},
      {id:"mono",      name:"Monotonic Stack + Queue", link:"https://cp-algorithms.com/data_structures/stack_queue_modification.html",subs:["Next Greater Element","Previous Greater/Smaller","Largest rectangle in histogram","Sliding window using stack","Monotonic Queue DP optimization"]},
      {id:"greedy",    name:"Greedy",                  link:"https://cp-algorithms.com/greedy/index.html",                            subs:["Activity Selection","Interval Scheduling / Merging","Jump Game variants","Task Scheduler","Greedy + Sorting combos","Greedy + DS (heap/seg tree)","Exchange argument proofs"]},
      {id:"bitmask",   name:"Bitmask DP",              link:"https://cp-algorithms.com/algebra/all-submasks.html",                   subs:["Subset enumeration","TSP / Hamiltonian path DP","Bitmask over states","Backtracking + Bitmask"]},
      {id:"bipartite", name:"Bipartite Check",         link:"https://cp-algorithms.com/graph/bipartite-check.html",                  subs:["2-coloring via BFS","2-coloring via DFS","Odd cycle detection"]},
      {id:"mst",       name:"MST",                     link:"https://cp-algorithms.com/graph/mst_kruskal.html",                      subs:["Kruskal (DSU based)","Prim's algorithm","MST on dense graphs"]},
      {id:"heaps",     name:"Heaps — Advanced",        link:"https://cp-algorithms.com/graph/dijkstra.html",                        subs:["Two heaps pattern (median finder)","Lazy deletion in heap","DSU + Heap combo","Heap optimized Dijkstra"]},
      {id:"lru",       name:"LRU / LFU Cache",         link:"https://cp-algorithms.com/",                                           subs:["LRU with HashMap + DLL","LFU with frequency buckets","O(1) get and put"]},
      {id:"trie",      name:"Trie",                    link:"https://cp-algorithms.com/string/aho_corasick.html",                    subs:["Insert, Search, Prefix","Word break via Trie","Trie on bits (max XOR)","XOR Basis / Linear Basis"]},
    ]
  },
  {
    id:"t2", num:"02", label:"Tier 2", title:"Do These Next",
    accent:"#f97316", track:"rgba(249,115,22,0.12)", soft:"rgba(249,115,22,0.06)",
    topics:[
      {id:"lazy-seg",    name:"Segment Tree — Lazy Prop",    link:"https://cp-algorithms.com/data_structures/segment_tree.html",     subs:["Range assign + range sum","Range add + range min/max","Composing lazy tags"]},
      {id:"euler-tour",  name:"Euler Tour / Tree Flatten",   link:"https://cp-algorithms.com/graph/euler_path.html",                subs:["In/out time DFS","Flattening tree to array","Range queries on subtree","LCA using Euler Tour + RMQ"]},
      {id:"tree-dp",     name:"Tree DP",                     link:"https://cp-algorithms.com/graph/tree-dp.html",                   subs:["Basic subtree DP","Re-rooting technique","DP on paths","Diameter / max path sum"]},
      {id:"kmp-z",       name:"KMP + Z-algorithm",           link:"https://cp-algorithms.com/string/prefix-function.html",          subs:["Failure function (KMP)","Pattern search via KMP","Z-array construction","Pattern search via Z-algo","Period of a string"]},
      {id:"str-hash",    name:"String Hashing + Rabin-Karp", link:"https://cp-algorithms.com/string/string-hashing.html",          subs:["Polynomial rolling hash","Double hashing (anti-collision)","Rabin-Karp multi-pattern","Substring comparison in O(1)"]},
      {id:"digit-dp",    name:"Digit DP",                    link:"https://cp-algorithms.com/dynamic_programming/digit-dp.html",    subs:["Count numbers in [L,R] with property","Tight constraint handling","Digit DP with sum/count states"]},
      {id:"interval-dp", name:"Interval DP (MCM)",           link:"https://cp-algorithms.com/dynamic_programming/index.html",       subs:["Matrix Chain Multiplication","Burst Balloons","Palindrome partitioning","Optimal BST"]},
      {id:"sweep",       name:"Sweep Line",                  link:"https://cp-algorithms.com/geometry/intersecting_segments.html",  subs:["Merge intervals","Insert intervals","Meeting rooms variants","Employee free time","Area of union of rectangles"]},
      {id:"bs-adv",      name:"Binary Search — Advanced",    link:"https://cp-algorithms.com/num_methods/binary_search.html",      subs:["BS on answer","BS on floating point","BS + Greedy","BS on complex predicates","BS on Segment Tree / BIT"]},
      {id:"scc",         name:"SCC",                         link:"https://cp-algorithms.com/graph/strongly-connected-components.html",subs:["Kosaraju's algorithm","Tarjan's algorithm","Condensation DAG","2-SAT"]},
      {id:"mat-exp",     name:"Matrix Exponentiation",       link:"https://cp-algorithms.com/algebra/matrix-exp.html",             subs:["Matrix multiply in O(n^3)","Fast exponentiation for matrices","Linear recurrence to matrix form","Fibonacci in O(log n)"]},
      {id:"backtrack",   name:"Backtracking — Advanced",     link:"https://cp-algorithms.com/",                                    subs:["Palindrome partitioning","Letter combinations","Backtracking + Pruning","Backtracking + Bitmask","Hamiltonian path on graphs"]},
    ]
  },
  {
    id:"t3", num:"03", label:"Tier 3", title:"After Tier 1 + 2",
    accent:"#eab308", track:"rgba(234,179,8,0.12)", soft:"rgba(234,179,8,0.06)",
    topics:[
      {id:"dp-str",    name:"DP on Strings",             link:"https://cp-algorithms.com/string/edit-distance.html",              subs:["LCS","Edit Distance","Longest Palindromic Subsequence","Shortest Common Supersequence","Wildcard / Regex matching"]},
      {id:"dp-graph",  name:"DP on Graphs",              link:"https://cp-algorithms.com/dynamic_programming/index.html",        subs:["DP on DAG","Shortest path DP","Counting paths in DAG","DP on SCC condensation"]},
      {id:"manacher",  name:"Manacher's Algorithm",      link:"https://cp-algorithms.com/string/manacher.html",                  subs:["Palindrome radius array","Longest palindromic substring","Count palindromic substrings"]},
      {id:"aho",       name:"Aho-Corasick",              link:"https://cp-algorithms.com/string/aho_corasick.html",              subs:["Trie + failure links","Multi-pattern search","Aho-Corasick + DP"]},
      {id:"centroid",  name:"Centroid Decomposition",    link:"https://cp-algorithms.com/graph/centroid-decomposition.html",     subs:["Finding centroid","Centroid tree construction","Distance queries on tree"]},
      {id:"hld",       name:"Heavy Light Decomp.",       link:"https://cp-algorithms.com/graph/hld.html",                       subs:["Chain decomposition","Path queries on tree","HLD + Segment Tree"]},
      {id:"dsu-tree",  name:"DSU on Tree",               link:"https://cp-algorithms.com/graph/dsu_on_tree.html",                subs:["Small to large merging","Subtree distinct count","DSU on tree for offline queries"]},
      {id:"suffix",    name:"Suffix Array / Automaton",  link:"https://cp-algorithms.com/string/suffix-array.html",             subs:["Suffix array O(n log n)","LCP array","Suffix automaton construction","Distinct substrings count"]},
      {id:"cht",       name:"CHT + D&C DP Opt",          link:"https://cp-algorithms.com/dynamic_programming/convex_hull_trick.html",subs:["Convex Hull Trick","Li Chao tree","Divide and Conquer DP","Knuth's optimization"]},
      {id:"flow",      name:"Network Flow",              link:"https://cp-algorithms.com/graph/edmonds_karp.html",              subs:["Ford-Fulkerson","Edmonds-Karp (BFS)","Dinic's algorithm","Min cut = Max flow","Bipartite matching via flow"]},
      {id:"persist",   name:"Persistent Segment Tree",   link:"https://cp-algorithms.com/data_structures/persistent-segment-tree.html",subs:["Version control on seg tree","Kth smallest in range","Offline range queries"]},
      {id:"comb",      name:"Combinatorics + NT",        link:"https://cp-algorithms.com/algebra/module-inverse.html",          subs:["Modular inverse (Fermat + ext GCD)","nCr % mod","Lucas theorem","Euler's Totient","CRT","Sieve","Prime factorization"]},
      {id:"xor",       name:"XOR / Linear Basis",        link:"https://cp-algorithms.com/algebra/linear-basis.html",            subs:["Gaussian elimination over GF(2)","Max XOR subset","Linear independence of bits"]},
    ]
  },
  {
    id:"t4", num:"04", label:"Tier 4", title:"Rare / CF Territory",
    accent:"#6b7280", track:"rgba(107,114,128,0.12)", soft:"rgba(107,114,128,0.06)",
    topics:[
      {id:"rand",    name:"Randomized Algorithms",   link:"https://cp-algorithms.com/",                                      subs:["QuickSelect","Reservoir Sampling","Fisher-Yates Shuffle","Miller-Rabin","Karger's Min Cut","Bloom Filters"]},
      {id:"game",    name:"Game Theory",             link:"https://cp-algorithms.com/game_theory/sprague-grundy-nim.html",  subs:["Nim game","Grundy numbers","Sprague-Grundy","Game DP","Minimax","Alpha-Beta Pruning","Staircase Nim","Misere games"]},
      {id:"geom",    name:"Geometry",                link:"https://cp-algorithms.com/geometry/convex-hull.html",            subs:["Convex Hull","Line intersection","Point in polygon","Rotating calipers"]},
      {id:"fft",     name:"NTT / FFT",               link:"https://cp-algorithms.com/algebra/fft.html",                    subs:["DFT / IDFT","FFT polynomial multiply","NTT mod-friendly","Convolution problems"]},
      {id:"lct",     name:"Link Cut Trees",          link:"https://cp-algorithms.com/graph/link_cut_trees.html",           subs:["Access / splay","Link and cut edges","Dynamic connectivity"]},
      {id:"sos",     name:"SOS DP",                  link:"https://cp-algorithms.com/algebra/all-submasks.html",           subs:["Subset sum over bitmasks","Superset sum DP","OR / AND convolution"]},
      {id:"euler-p", name:"Eulerian Path / Circuit", link:"https://cp-algorithms.com/graph/euler_path.html",              subs:["Hierholzer's algorithm","Directed vs undirected","Existence conditions"]},
      {id:"morris",  name:"Morris Traversal",        link:"https://cp-algorithms.com/",                                   subs:["Inorder without stack","Preorder Morris","O(1) space traversal"]},
    ]
  },
];

const SK = "dsa-pro-v1";

/* ─── PARALLAX HOOK ─────────────────────────────────────────────────────── */
function useParallax(speed = 0.08) {
  const ref = useRef(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      setY(mid * speed);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [speed]);
  return [ref, y];
}

/* ─── INTERSECTION HOOK ─────────────────────────────────────────────────── */
function useVisible(threshold = 0.08) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, v];
}

/* ─── SCROLL Y ──────────────────────────────────────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

/* ─── GLOBAL PROGRESS BAR ──────────────────────────────────────────────── */
function GlobalBar({ pct }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:9999, background:"#1a1a2e" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)", transition:"width 0.8s cubic-bezier(.4,0,.2,1)" }}/>
    </div>
  );
}

/* ─── NAV ───────────────────────────────────────────────────────────────── */
function Nav({ pct, done, total, scrollY }) {
  const show = scrollY > 300;
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:9000, padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", background: scrollY > 60 ? "rgba(9,9,18,0.92)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,0.06)" : "none", transition:"all 0.4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#a78bfa)", boxShadow:"0 0 10px rgba(99,102,241,0.6)" }}/>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"rgba(255,255,255,0.7)", letterSpacing:"0.05em" }}>DSA Tracker</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16, opacity: show ? 1:0, transition:"opacity 0.4s" }}>
        <div style={{ width:80, height:3, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius:99, transition:"width 0.8s" }}/>
        </div>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"rgba(255,255,255,0.4)" }}>{done}/{total}</span>
      </div>
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────────────────────── */
function Hero({ pct, done, total, scrollY }) {
  const lift   = scrollY * 0.38;
  const fade   = Math.max(0, 1 - scrollY / 560);
  const slow   = scrollY * 0.14;

  const allTiersDone = TIERS.map(t => {
    const subs = t.topics.flatMap((tp,_) => tp.subs.map((_,i) => `${tp.id}-${i}`));
    return { label: t.label, color: t.accent };
  });

  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"80px 24px 60px" }}>

      {/* Background grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px", transform:`translateY(${slow}px)`, pointerEvents:"none" }}/>

      {/* Radial fade over grid */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 50%,transparent 30%,#090912 80%)", pointerEvents:"none" }}/>

      {/* Glow orbs */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"20%", left:"15%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", filter:"blur(60px)", transform:`translateY(${scrollY*0.06}px)` }}/>
        <div style={{ position:"absolute", bottom:"20%", right:"12%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)", filter:"blur(80px)", transform:`translateY(${-scrollY*0.05}px)` }}/>
      </div>

      {/* Content */}
      <div style={{ position:"relative", textAlign:"center", transform:`translateY(${lift}px)`, opacity:fade, maxWidth:760 }}>

        {/* Badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:99, padding:"5px 14px", marginBottom:40 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:"#6366f1", boxShadow:"0 0 6px rgba(99,102,241,0.8)", animation:"blink 2s ease-in-out infinite" }}/>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Knight on LC · Specialist on CF</span>
        </div>

        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(44px,9vw,108px)", fontWeight:800, lineHeight:0.95, letterSpacing:"-0.03em", margin:"0 0 16px" }}>
          <span style={{ display:"block", color:"#ffffff" }}>FAANG Prep</span>
          <span style={{ display:"block", background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a78bfa 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Tracker</span>
        </h1>

        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:"rgba(255,255,255,0.45)", maxWidth:480, margin:"0 auto 56px", lineHeight:1.6 }}>
          Your personalised gap-analysis battle plan. Track every algorithm, every subtopic, every tier.
        </p>

        {/* Stats row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, flexWrap:"wrap" }}>
          {/* Ring */}
          <div style={{ position:"relative", width:110, height:110 }}>
            <svg width={110} height={110} style={{ transform:"rotate(-90deg)" }}>
              <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
              </defs>
              <circle cx={55} cy={55} r={46} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6}/>
              <circle cx={55} cy={55} r={46} fill="none" stroke="url(#rg)" strokeWidth={6} strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*46}`}
                strokeDashoffset={`${2*Math.PI*46*(1 - pct/100)}`}
                style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"#fff" }}>{pct}%</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{done}/{total}</span>
            </div>
          </div>

          {/* Tier mini bars */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, minWidth:200 }}>
            {TIERS.map(t => {
              const s = t.topics.flatMap((tp) => tp.subs.map((_,i) => `${tp.id}-${i}`));
              return (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:t.accent, flexShrink:0 }}/>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.4)", width:56 }}>{t.label}</span>
                  <div style={{ flex:1, height:2, background:"rgba(255,255,255,0.06)", borderRadius:99 }}>
                    <div style={{ height:"100%", width:"0%", background:t.accent, borderRadius:99, transition:"width 1s" }}/>
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.25)", width:30, textAlign:"right" }}>{s.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop:64, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <div style={{ width:1, height:40, background:"linear-gradient(to bottom,rgba(99,102,241,0.5),transparent)", animation:"scrollline 2s ease-in-out infinite" }}/>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.18)", letterSpacing:"0.15em", textTransform:"uppercase" }}>scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ─── TIER SECTION ──────────────────────────────────────────────────────── */
function TierSection({ tier, done, onToggleSub, onToggleAll, filter }) {
  const [secRef, pxOff] = useParallax(0.09);
  const [headRef, headVis] = useVisible(0.05);
  const [openTopics, setOpenTopics] = useState({});

  const allSubs = tier.topics.flatMap(t => t.subs.map((_,i) => `${t.id}-${i}`));
  const tierDone = allSubs.filter(id => done[id]).length;
  const tierPct  = allSubs.length ? Math.round(tierDone / allSubs.length * 100) : 0;

  const tProg = t => {
    const d = t.subs.filter((_,i) => done[`${t.id}-${i}`]).length;
    return { d, n: t.subs.length, pct: t.subs.length ? Math.round(d/t.subs.length*100) : 0 };
  };

  const filtered = tier.topics.filter(t => {
    if (filter === "all") return true;
    const { d, n } = tProg(t);
    return filter === "done" ? d === n : d < n;
  });

  if (!filtered.length) return null;

  return (
    <section ref={secRef} style={{ position:"relative", padding:"100px 0 60px" }}>
      {/* Ambient */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 50% 35% at 50% 50%,${tier.soft} 0%,transparent 100%)`, pointerEvents:"none" }}/>

      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px" }}>

        {/* Header */}
        <div ref={headRef} style={{ display:"flex", alignItems:"center", gap:24, marginBottom:48, position:"relative" }}>

          {/* Number — faster parallax */}
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(80px,12vw,160px)", fontWeight:800, lineHeight:1, color:"transparent", WebkitTextStroke:`1px ${tier.accent}`, opacity:0.1, userSelect:"none", flexShrink:0, transform:`translateY(${-pxOff * 1.6}px)`, transition:"transform 0.05s linear" }}>
            {tier.num}
          </div>

          {/* Text — slower parallax */}
          <div style={{ transform:`translateY(${-pxOff * 0.5}px)`, transition:"transform 0.05s linear" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:tier.track, border:`1px solid ${tier.accent}28`, borderRadius:99, padding:"3px 12px", marginBottom:12, opacity:headVis?1:0, transform:headVis?"none":"translateY(6px)", transition:"all 0.6s 0.05s ease" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:tier.accent }}/>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:tier.accent, letterSpacing:"0.1em" }}>{tier.label}</span>
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(28px,4vw,56px)", color:"#ffffff", lineHeight:1.05, margin:"0 0 16px", letterSpacing:"-0.02em", opacity:headVis?1:0, transform:headVis?"none":"translateY(10px)", transition:"all 0.7s 0.1s ease" }}>
              {tier.title}
            </h2>
            {/* Progress */}
            <div style={{ display:"flex", alignItems:"center", gap:12, opacity:headVis?1:0, transition:"opacity 0.7s 0.25s" }}>
              <div style={{ width:160, height:3, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${tierPct}%`, background:tier.accent, borderRadius:99, transition:"width 1.2s 0.3s cubic-bezier(.4,0,.2,1)" }}/>
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"rgba(255,255,255,0.35)" }}>{tierDone} / {allSubs.length}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:8 }}>
          {filtered.map((topic, ti) => {
            const { d, n, pct: tPct } = tProg(topic);
            const allDone = d === n;
            return (
              <TopicCard key={topic.id} topic={topic} tier={tier}
                d={d} n={n} tPct={tPct} allDone={allDone}
                isOpen={!!openTopics[topic.id]} done={done}
                delay={ti * 0.035}
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
}

/* ─── TOPIC CARD ────────────────────────────────────────────────────────── */
function TopicCard({ topic, tier, d, n, tPct, allDone, isOpen, done, delay, onToggleOpen, onToggleAll, onToggleSub }) {
  const [cardRef, vis] = useVisible(0.04);
  const [hov, setHov] = useState(false);

  return (
    <div ref={cardRef} style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(16px)", transition:`opacity 0.5s ${delay+0.15}s ease, transform 0.5s ${delay+0.15}s ease` }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ background:hov?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.02)", border:`1px solid ${hov ? tier.accent+"60" : "rgba(255,255,255,0.08)"}`, borderRadius:12, overflow:"hidden", transition:"border-color 0.2s, background 0.2s, box-shadow 0.2s", boxShadow:hov?`0 0 0 1px ${tier.accent}20, 0 8px 32px rgba(0,0,0,0.4)`:"0 2px 8px rgba(0,0,0,0.2)" }}
      >
        {/* Top row */}
        <div onClick={onToggleOpen} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer" }}>
          {/* Arrow */}
          <div style={{ width:24, height:24, borderRadius:6, border:`1px solid ${allDone?"#22c55e":tier.accent+"50"}`, background:allDone?"rgba(34,197,94,0.1)":tier.soft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
            {allDone
              ? <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="8" height="8" viewBox="0 0 8 8" style={{ transform:isOpen?"rotate(90deg)":"none", transition:"transform 0.25s" }}><polyline points="2,1 6,4 2,7" fill="none" stroke={tier.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, color:allDone?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.92)", textDecoration:allDone?"line-through":"none", textDecorationColor:"rgba(255,255,255,0.15)", letterSpacing:"-0.01em", marginBottom:7, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {topic.name}
            </div>
            {/* progress track */}
            <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${tPct}%`, background:allDone?"#22c55e":tier.accent, borderRadius:99, transition:"width 0.5s" }}/>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.25)" }}>{d}/{n}</span>
            {/* mark-all */}
            <div onClick={e=>{e.stopPropagation();onToggleAll();}} title="Mark all done"
              style={{ width:24, height:24, borderRadius:6, border:`1px solid ${allDone?"#22c55e40":"rgba(255,255,255,0.1)"}`, background:allDone?"rgba(34,197,94,0.1)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s" }}>
              {allDone
                ? <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <div style={{ width:6, height:6, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)" }}/>
              }
            </div>
            {/* cp-algo */}
            <a href={topic.link} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:"3px 8px", borderRadius:5, border:`1px solid ${tier.accent}40`, color:tier.accent, textDecoration:"none", letterSpacing:"0.06em", opacity:0.65, whiteSpace:"nowrap", transition:"opacity 0.15s, background 0.15s", background:"transparent" }}
              onMouseEnter={e=>{e.currentTarget.style.opacity="1"; e.currentTarget.style.background=tier.soft;}}
              onMouseLeave={e=>{e.currentTarget.style.opacity="0.65"; e.currentTarget.style.background="transparent";}}
            >ALGO ↗</a>
          </div>
        </div>

        {/* Subtopics */}
        <div style={{ maxHeight:isOpen?600:0, overflow:"hidden", transition:"max-height 0.4s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"4px 0" }}>
            {topic.subs.map((sub, si) => {
              const sid = `${topic.id}-${si}`, dk = !!done[sid];
              return (
                <div key={sid} onClick={() => onToggleSub(sid)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 16px 8px 52px", cursor:"pointer", transition:"background 0.12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.025)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{ width:14, height:14, borderRadius:4, border:`1px solid ${dk?"#22c55e60":"rgba(255,255,255,0.12)"}`, background:dk?"rgba(34,197,94,0.12)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                    {dk && <svg width="8" height="8" viewBox="0 0 8 8"><polyline points="1,4 3,6 7,2" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:400, color:dk?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.65)", textDecoration:dk?"line-through":"none", textDecorationColor:"rgba(255,255,255,0.12)" }}>
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
}

/* ─── SECTION DIVIDER ───────────────────────────────────────────────────── */
function Divider({ color }) {
  return (
    <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 24px" }}>
      <div style={{ height:1, background:`linear-gradient(90deg,transparent,${color}40 30%,${color}40 70%,transparent)` }}/>
    </div>
  );
}

/* ─── FILTER BAR ────────────────────────────────────────────────────────── */
function FilterBar({ filter, setFilter, scrollY }) {
  const show = scrollY > 400;
  return (
    <div style={{ position:"fixed", bottom:28, left:"50%", transform:`translateX(-50%) translateY(${show?0:80}px)`, zIndex:9000, transition:"transform 0.5s cubic-bezier(.4,0,.2,1)", display:"flex", gap:2, background:"rgba(14,14,28,0.9)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:99, padding:4 }}>
      {["all","pending","done"].map(f => (
        <button key={f} onClick={() => setFilter(f)} style={{ padding:"7px 20px", borderRadius:99, fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer", transition:"all 0.2s", background:filter===f?"rgba(99,102,241,0.9)":"transparent", color:filter===f?"#fff":"rgba(255,255,255,0.35)", fontWeight:filter===f?600:400 }}>
          {f}
        </button>
      ))}
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [done, setDone]     = useState(() => { try { return JSON.parse(localStorage.getItem(SK)||"{}"); } catch { return {}; } });
  const [filter, setFilter] = useState("all");
  const scrollY = useScrollY();

  useEffect(() => { try { localStorage.setItem(SK, JSON.stringify(done)); } catch {} }, [done]);

  const toggleSub = useCallback(id => setDone(d => ({...d, [id]:!d[id]})), []);
  const toggleAll = useCallback(topic => setDone(d => {
    const all = topic.subs.every((_,i) => d[`${topic.id}-${i}`]);
    const n = {...d};
    topic.subs.forEach((_,i) => { n[`${topic.id}-${i}`] = !all; });
    return n;
  }), []);

  const allSubs   = TIERS.flatMap(t => t.topics.flatMap(tp => tp.subs.map((_,i) => `${tp.id}-${i}`)));
  const totalDone = allSubs.filter(id => done[id]).length;
  const pct       = allSubs.length ? Math.round(totalDone / allSubs.length * 100) : 0;

  return (
    <div style={{ background:"#090912", color:"#fff", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#090912; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.3); border-radius:99px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scrollline { 0%,100%{opacity:0.3;transform:scaleY(1)} 50%{opacity:0.7;transform:scaleY(1.2)} }
        ::selection { background:rgba(99,102,241,0.3); }
        button { cursor:pointer; }
        a { cursor:pointer; }
      `}</style>

      <GlobalBar pct={pct} />
      <Nav pct={pct} done={totalDone} total={allSubs.length} scrollY={scrollY} />
      <FilterBar filter={filter} setFilter={setFilter} scrollY={scrollY} />

      <Hero pct={pct} done={totalDone} total={allSubs.length} scrollY={scrollY} />

      {TIERS.map((tier, i) => (
        <div key={tier.id}>
          <Divider color={tier.accent} />
          <TierSection tier={tier} done={done} onToggleSub={toggleSub} onToggleAll={toggleAll} filter={filter} />
        </div>
      ))}

      <footer style={{ textAlign:"center", padding:"80px 24px 48px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,6vw,80px)", fontWeight:800, letterSpacing:"-0.03em", color:"rgba(255,255,255,0.03)", userSelect:"none" }}>KEEP GRINDING</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.12)", letterSpacing:"0.15em", marginTop:10 }}>PROGRESS SAVED · {totalDone}/{allSubs.length} COMPLETE</div>
      </footer>
    </div>
  );
}