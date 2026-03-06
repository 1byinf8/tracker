import { useState, useEffect } from "react";

const TOPICS = {
  "🔴 Tier 1 — High Priority": [
    { id: "seg-tree", name: "Segment Tree", link: "https://cp-algorithms.com/data_structures/segment_tree.html", subs: ["Build, Query, Update", "Point update range query", "Range update point query"] },
    { id: "bit", name: "Fenwick Tree / BIT", link: "https://cp-algorithms.com/data_structures/fenwick.html", subs: ["Point update prefix sum", "Range update range query", "2D BIT"] },
    { id: "mono-stack", name: "Monotonic Stack + Queue", link: "https://cp-algorithms.com/data_structures/stack_queue_modification.html", subs: ["Next Greater Element", "Previous Greater/Smaller", "Largest rectangle in histogram", "Sliding window using stack", "Monotonic Queue DP optimization"] },
    { id: "greedy", name: "Greedy", link: "https://cp-algorithms.com/greedy/index.html", subs: ["Activity Selection", "Interval Scheduling / Merging", "Jump Game variants", "Task Scheduler", "Greedy + Sorting combos", "Greedy + DS (heap/seg tree)", "Exchange argument proofs"] },
    { id: "bitmask-dp", name: "Bitmask DP", link: "https://cp-algorithms.com/algebra/all-submasks.html", subs: ["Subset enumeration", "TSP / Hamiltonian path DP", "Bitmask over states", "Backtracking + Bitmask"] },
    { id: "bipartite", name: "Bipartite Check", link: "https://cp-algorithms.com/graph/bipartite-check.html", subs: ["2-coloring via BFS", "2-coloring via DFS", "Odd cycle detection"] },
    { id: "mst", name: "MST", link: "https://cp-algorithms.com/graph/mst_kruskal.html", subs: ["Kruskal (DSU based)", "Prim's algorithm", "MST on dense graphs"] },
    { id: "two-heaps", name: "Heaps — Advanced", link: "https://cp-algorithms.com/graph/dijkstra.html", subs: ["Two heaps pattern (median finder)", "Lazy deletion in heap", "DSU + Heap combo", "Heap optimized Dijkstra"] },
    { id: "lru", name: "LRU / LFU Cache", link: "https://cp-algorithms.com/", subs: ["LRU with HashMap + DLL", "LFU with frequency buckets", "O(1) get and put"] },
    { id: "trie", name: "Trie", link: "https://cp-algorithms.com/string/aho_corasick.html", subs: ["Insert, Search, Prefix", "Word break via Trie", "Trie on bits (max XOR)", "XOR Basis / Linear Basis"] },
  ],
  "🟠 Tier 2 — Do These Next": [
    { id: "lazy-seg", name: "Segment Tree — Lazy Propagation", link: "https://cp-algorithms.com/data_structures/segment_tree.html#toc-tgt-8", subs: ["Range assign + range sum", "Range add + range min/max", "Composing lazy tags"] },
    { id: "euler-tour", name: "Euler Tour / Tree Flattening", link: "https://cp-algorithms.com/graph/euler_path.html", subs: ["In/out time DFS", "Flattening tree to array", "Range queries on subtree", "LCA using Euler Tour + RMQ"] },
    { id: "tree-dp", name: "Tree DP", link: "https://cp-algorithms.com/graph/tree-dp.html", subs: ["Basic subtree DP", "Re-rooting technique", "DP on paths", "Diameter / max path sum"] },
    { id: "kmp-z", name: "KMP + Z-algorithm", link: "https://cp-algorithms.com/string/prefix-function.html", subs: ["Failure function (KMP)", "Pattern search via KMP", "Z-array construction", "Pattern search via Z-algo", "Period of a string"] },
    { id: "string-hash", name: "String Hashing + Rabin-Karp", link: "https://cp-algorithms.com/string/string-hashing.html", subs: ["Polynomial rolling hash", "Double hashing (anti-collision)", "Rabin-Karp multi-pattern", "Substring comparison in O(1)"] },
    { id: "digit-dp", name: "Digit DP", link: "https://cp-algorithms.com/dynamic_programming/digit-dp.html", subs: ["Count numbers in [L,R] with property", "Tight constraint handling", "Digit DP with sum/count states"] },
    { id: "interval-dp", name: "Interval DP (MCM)", link: "https://cp-algorithms.com/dynamic_programming/index.html", subs: ["Matrix Chain Multiplication", "Burst Balloons", "Palindrome partitioning", "Optimal BST"] },
    { id: "sweep-line", name: "Sweep Line", link: "https://cp-algorithms.com/geometry/intersecting_segments.html", subs: ["Merge intervals", "Insert intervals", "Meeting rooms variants", "Employee free time", "Area of union of rectangles"] },
    { id: "bs-adv", name: "Binary Search — Advanced", link: "https://cp-algorithms.com/num_methods/binary_search.html", subs: ["BS on answer", "BS on floating point", "BS + Greedy", "BS on complex predicates", "BS on Segment Tree / BIT"] },
    { id: "scc", name: "SCC", link: "https://cp-algorithms.com/graph/strongly-connected-components.html", subs: ["Kosaraju's algorithm", "Tarjan's algorithm", "Condensation DAG", "2-SAT"] },
    { id: "matrix-exp", name: "Matrix Exponentiation", link: "https://cp-algorithms.com/algebra/matrix-exp.html", subs: ["Matrix multiply in O(n^3)", "Fast exponentiation for matrices", "Linear recurrence to matrix form", "Fibonacci in O(log n)"] },
    { id: "backtrack", name: "Backtracking — Advanced", link: "https://cp-algorithms.com/", subs: ["Palindrome partitioning", "Letter combinations", "Backtracking + Pruning", "Backtracking + Bitmask", "Hamiltonian path on graphs"] },
  ],
  "🟡 Tier 3 — Cover After Tier 1+2": [
    { id: "dp-strings", name: "DP on Strings", link: "https://cp-algorithms.com/string/edit-distance.html", subs: ["LCS", "Edit Distance", "Longest Palindromic Subsequence", "Shortest Common Supersequence", "Wildcard / Regex matching"] },
    { id: "graph-dp", name: "DP on Graphs", link: "https://cp-algorithms.com/dynamic_programming/index.html", subs: ["DP on DAG", "Shortest path DP", "Counting paths in DAG", "DP on SCC condensation"] },
    { id: "manacher", name: "Manacher's Algorithm", link: "https://cp-algorithms.com/string/manacher.html", subs: ["Palindrome radius array", "Longest palindromic substring", "Count palindromic substrings"] },
    { id: "aho", name: "Aho-Corasick", link: "https://cp-algorithms.com/string/aho_corasick.html", subs: ["Trie + failure links", "Multi-pattern search", "Aho-Corasick + DP"] },
    { id: "centroid", name: "Centroid Decomposition", link: "https://cp-algorithms.com/graph/centroid-decomposition.html", subs: ["Finding centroid", "Centroid tree construction", "Distance queries on tree"] },
    { id: "hld", name: "Heavy Light Decomposition", link: "https://cp-algorithms.com/graph/hld.html", subs: ["Chain decomposition", "Path queries on tree", "HLD + Segment Tree"] },
    { id: "dsu-tree", name: "DSU on Tree (Small to Large)", link: "https://cp-algorithms.com/graph/dsu_on_tree.html", subs: ["Small to large merging", "Subtree distinct count", "DSU on tree for offline queries"] },
    { id: "suffix", name: "Suffix Array / Automaton", link: "https://cp-algorithms.com/string/suffix-array.html", subs: ["Suffix array construction O(n log n)", "LCP array", "Suffix automaton construction", "Distinct substrings count"] },
    { id: "cht", name: "CHT + D&C DP Optimization", link: "https://cp-algorithms.com/dynamic_programming/convex_hull_trick.html", subs: ["Convex Hull Trick (CHT)", "Li Chao tree", "Divide and Conquer DP", "Knuth's optimization"] },
    { id: "flow", name: "Network Flow", link: "https://cp-algorithms.com/graph/edmonds_karp.html", subs: ["Ford-Fulkerson", "Edmonds-Karp (BFS based)", "Dinic's algorithm", "Min cut = Max flow", "Bipartite matching via flow"] },
    { id: "persist-st", name: "Persistent Segment Tree", link: "https://cp-algorithms.com/data_structures/persistent-segment-tree.html", subs: ["Version control on seg tree", "Kth smallest in range", "Offline range queries"] },
    { id: "comb", name: "Combinatorics + Number Theory", link: "https://cp-algorithms.com/algebra/module-inverse.html", subs: ["Modular inverse (Fermat + ext GCD)", "nCr % mod", "Lucas theorem", "Euler's Totient Function", "Chinese Remainder Theorem", "Sieve of Eratosthenes", "Prime factorization"] },
    { id: "xor-basis", name: "XOR Basis / Linear Basis", link: "https://cp-algorithms.com/algebra/linear-basis.html", subs: ["Gaussian elimination over GF(2)", "Max XOR subset", "Linear independence of bits"] },
  ],
  "⚪ Tier 4 — Rare / CF Territory": [
    { id: "rand-algo", name: "Randomized Algorithms", link: "https://cp-algorithms.com/", subs: ["QuickSelect (Kth element)", "Reservoir Sampling", "Fisher-Yates Shuffle", "Miller-Rabin Primality Test", "Karger's Min Cut", "Bloom Filters", "Monte Carlo vs Las Vegas"] },
    { id: "game-theory", name: "Game Theory", link: "https://cp-algorithms.com/game_theory/sprague-grundy-nim.html", subs: ["Nim game", "Grundy numbers", "Sprague-Grundy theorem", "Game DP", "Minimax", "Alpha-Beta Pruning", "Staircase Nim", "Misere games"] },
    { id: "geometry", name: "Geometry", link: "https://cp-algorithms.com/geometry/convex-hull.html", subs: ["Convex Hull (Graham scan / Monotone chain)", "Line intersection", "Point in polygon", "Rotating calipers"] },
    { id: "ntt", name: "NTT / FFT", link: "https://cp-algorithms.com/algebra/fft.html", subs: ["DFT / IDFT", "FFT for polynomial multiply", "NTT (mod-friendly FFT)", "Convolution problems"] },
    { id: "lct", name: "Link Cut Trees", link: "https://cp-algorithms.com/graph/link_cut_trees.html", subs: ["Access / splay operations", "Link and cut edges", "Dynamic connectivity"] },
    { id: "sos", name: "SOS DP (Sum over Subsets)", link: "https://cp-algorithms.com/algebra/all-submasks.html", subs: ["Subset sum DP over bitmasks", "Superset sum DP", "OR / AND convolution"] },
    { id: "euler-path", name: "Eulerian Path / Circuit", link: "https://cp-algorithms.com/graph/euler_path.html", subs: ["Hierholzer's algorithm", "Directed vs undirected Eulerian", "Existence conditions"] },
    { id: "morris", name: "Morris Traversal", link: "https://cp-algorithms.com/", subs: ["Inorder without stack/recursion", "Preorder Morris traversal", "O(1) space tree traversal"] },
  ],
};

const C = {
  "🔴 Tier 1 — High Priority": { bg:"rgba(239,68,68,0.07)", border:"rgba(239,68,68,0.3)", accent:"#ef4444", badge:"rgba(239,68,68,0.15)", sub:"rgba(239,68,68,0.035)" },
  "🟠 Tier 2 — Do These Next": { bg:"rgba(249,115,22,0.07)", border:"rgba(249,115,22,0.3)", accent:"#f97316", badge:"rgba(249,115,22,0.15)", sub:"rgba(249,115,22,0.035)" },
  "🟡 Tier 3 — Cover After Tier 1+2": { bg:"rgba(234,179,8,0.07)", border:"rgba(234,179,8,0.3)", accent:"#eab308", badge:"rgba(234,179,8,0.15)", sub:"rgba(234,179,8,0.035)" },
  "⚪ Tier 4 — Rare / CF Territory": { bg:"rgba(148,163,184,0.07)", border:"rgba(148,163,184,0.22)", accent:"#94a3b8", badge:"rgba(148,163,184,0.15)", sub:"rgba(148,163,184,0.03)" },
};

const STORAGE_KEY = "dsa-faang-tracker-v1";

export default function App() {
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
  });
  const [openTiers, setOpenTiers] = useState({"🔴 Tier 1 — High Priority":true});
  const [openTopics, setOpenTopics] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch {}
  }, [done]);

  const toggleSub = (id) => setDone(d => ({ ...d, [id]: !d[id] }));
  const toggleAll = (topic) => {
    const allD = topic.subs.every((_,i) => done[`${topic.id}-${i}`]);
    setDone(d => {
      const next = {...d};
      topic.subs.forEach((_,i) => { next[`${topic.id}-${i}`] = !allD; });
      return next;
    });
  };

  const tProg = (t) => {
    const d = t.subs.filter((_,i) => done[`${t.id}-${i}`]).length;
    return { d, t: t.subs.length, pct: Math.round(d / t.subs.length * 100) };
  };
  const tierProg = (topics) => {
    const s = topics.flatMap(t => t.subs.map((_,i) => `${t.id}-${i}`));
    const d = s.filter(id => done[id]).length;
    return { d, t: s.length, pct: Math.round(d / s.length * 100) };
  };

  const allSubs = Object.values(TOPICS).flat().flatMap(t => t.subs.map((_,i) => `${t.id}-${i}`));
  const totalDone = allSubs.filter(id => done[id]).length;
  const pct = Math.round(totalDone / allSubs.length * 100);

  return (
    <div style={{minHeight:"100vh",background:"#07090e",color:"#e2e8f0",fontFamily:"'JetBrains Mono','Fira Code',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
        .hov:hover{background:rgba(255,255,255,0.03)!important}
        .sub-hov:hover{background:rgba(255,255,255,0.018)!important}
        .cb{transition:transform 0.12s;cursor:pointer} .cb:hover{transform:scale(1.12)}
        .pf{transition:width 0.4s cubic-bezier(.4,0,.2,1)}
        @keyframes fi{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
        .fi{animation:fi 0.16s ease forwards}
        .lnk{transition:opacity 0.12s,transform 0.12s;text-decoration:none} .lnk:hover{opacity:1!important;transform:translateY(-1px)}
        button{cursor:pointer;font-family:inherit}
      `}</style>

      {/* STICKY HEADER */}
      <div style={{background:"linear-gradient(180deg,#0c1320 0%,#07090e 100%)",borderBottom:"1px solid rgba(56,189,248,0.1)",padding:"24px 18px 18px",position:"sticky",top:0,zIndex:20,backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:9,letterSpacing:"0.2em",color:"#38bdf8",marginBottom:4,textTransform:"uppercase"}}>DSA Battle Plan</div>
              <div style={{fontSize:"clamp(18px,3.5vw,26px)",fontWeight:700,color:"#f0f9ff",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:"-0.02em",textShadow:"0 0 20px rgba(56,189,248,0.4)"}}>FAANG Prep Tracker</div>
              <div style={{fontSize:10,color:"#3d5166",marginTop:4}}>Knight on LC  •  Specialist on CF</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:30,fontWeight:700,color:"#38bdf8",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>{pct}%</div>
              <div style={{fontSize:10,color:"#3d5166",marginTop:2}}>{totalDone}/{allSubs.length} subtopics</div>
            </div>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden",marginTop:14}}>
            <div className="pf" style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#0ea5e9,#38bdf8)",borderRadius:99,boxShadow:"0 0 8px rgba(56,189,248,0.4)"}}/>
          </div>
          <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
            {["all","pending","done"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"3px 11px",borderRadius:99,fontSize:9,border:filter===f?"1px solid #38bdf8":"1px solid rgba(255,255,255,0.07)",background:filter===f?"rgba(56,189,248,0.1)":"transparent",color:filter===f?"#38bdf8":"#3d5166",letterSpacing:"0.07em",textTransform:"uppercase"}}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{maxWidth:860,margin:"0 auto",padding:"18px 12px 80px"}}>
        {Object.entries(TOPICS).map(([tier,topics])=>{
          const c=C[tier], prog=tierProg(topics), isOpen=openTiers[tier];
          const filtered = topics.filter(t=>{
            if(filter==="all") return true;
            const {d,t:tot}=tProg(t);
            return filter==="done"?d===tot:d<tot;
          });
          if(filter!=="all"&&filtered.length===0) return null;

          return (
            <div key={tier} style={{marginBottom:12}}>
              <div className="hov" onClick={()=>setOpenTiers(e=>({...e,[tier]:!e[tier]}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:isOpen?"9px 9px 0 0":"9px",background:c.bg,border:`1px solid ${c.border}`,cursor:"pointer",borderBottom:isOpen?`1px solid ${c.border}`:undefined}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div style={{fontSize:11,fontWeight:600,color:c.accent,fontFamily:"'Space Grotesk',sans-serif"}}>{tier}</div>
                  <div style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:c.badge,color:c.accent}}>{prog.d}/{prog.t}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:60,height:3,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${prog.pct}%`,background:c.accent,borderRadius:99}}/>
                  </div>
                  <span style={{color:c.accent,fontSize:11,display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
                </div>
              </div>

              {isOpen&&(
                <div className="fi" style={{border:`1px solid ${c.border}`,borderTop:"none",borderRadius:"0 0 9px 9px",overflow:"hidden"}}>
                  {filtered.map((topic,ti)=>{
                    const {d:tD,t:tT,pct:tPct}=tProg(topic);
                    const topicOpen=openTopics[topic.id];
                    const allDone=tD===tT;

                    return (
                      <div key={topic.id} style={{borderTop:ti>0?"1px solid rgba(255,255,255,0.03)":"none"}}>
                        <div className="hov" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:allDone?"rgba(34,197,94,0.03)":"transparent"}}>
                          <div onClick={()=>setOpenTopics(e=>({...e,[topic.id]:!e[topic.id]}))} style={{width:16,flexShrink:0,color:"#334155",fontSize:10,cursor:"pointer",userSelect:"none",textAlign:"center",transition:"transform 0.15s",transform:topicOpen?"rotate(90deg)":"none"}}>▶</div>
                          <div onClick={()=>setOpenTopics(e=>({...e,[topic.id]:!e[topic.id]}))} style={{flex:1,minWidth:0,cursor:"pointer"}}>
                            <div style={{fontSize:12,fontWeight:600,color:allDone?"#334155":"#f1f5f9",fontFamily:"'Space Grotesk',sans-serif",textDecoration:allDone?"line-through":"none"}}>{topic.name}</div>
                            <div style={{fontSize:9,color:"#2d3f52",marginTop:1}}>{tD}/{tT} subtopics</div>
                          </div>
                          <div style={{width:44,height:3,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden",flexShrink:0}}>
                            <div className="pf" style={{height:"100%",width:`${tPct}%`,background:allDone?"#22c55e":c.accent,borderRadius:99}}/>
                          </div>
                          <div className="cb" onClick={()=>toggleAll(topic)} style={{width:20,height:20,borderRadius:5,flexShrink:0,border:allDone?"2px solid #22c55e":`2px solid ${c.accent}`,background:allDone?"rgba(34,197,94,0.15)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {allDone&&<span style={{color:"#22c55e",fontSize:10,fontWeight:700}}>✓</span>}
                          </div>
                          <a href={topic.link} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="lnk" style={{fontSize:8,padding:"3px 7px",borderRadius:4,flexShrink:0,border:"1px solid rgba(56,189,248,0.18)",background:"rgba(56,189,248,0.05)",color:"#38bdf8",letterSpacing:"0.05em",opacity:0.6,whiteSpace:"nowrap"}}>cp-algo ↗</a>
                        </div>

                        {topicOpen&&(
                          <div className="fi" style={{background:c.sub,borderTop:"1px solid rgba(255,255,255,0.025)"}}>
                            {topic.subs.map((sub,si)=>{
                              const subId=`${topic.id}-${si}`, isDone=!!done[subId];
                              return (
                                <div key={subId} className="sub-hov" onClick={()=>toggleSub(subId)} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 14px 7px 42px",cursor:"pointer",borderTop:si>0?"1px solid rgba(255,255,255,0.02)":"none"}}>
                                  <div className="cb" style={{width:14,height:14,borderRadius:3,flexShrink:0,border:isDone?"2px solid #22c55e":"2px solid #1e3a5f",background:isDone?"rgba(34,197,94,0.15)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                    {isDone&&<span style={{color:"#22c55e",fontSize:8,fontWeight:700}}>✓</span>}
                                  </div>
                                  <div style={{fontSize:11,color:isDone?"#2d3f52":"#7c95ad",textDecoration:isDone?"line-through":"none"}}>{sub}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div style={{textAlign:"center",marginTop:36,color:"#1a2d40",fontSize:9,letterSpacing:"0.14em"}}>PROGRESS SAVED LOCALLY  •  KEEP GRINDING</div>
      </div>
    </div>
  );
}
