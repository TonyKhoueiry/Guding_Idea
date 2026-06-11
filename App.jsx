import React, { useState, useEffect } from 'react';

const INITIAL_PROJECTS = [
  {
    id: "patagonia",
    name: "Patagonia",
    phase1: {
      attributes: [
        { id: "pat-attr-1", value: "Premium Gear" },
        { id: "pat-attr-2", value: "Repairable Textiles" },
        { id: "pat-attr-3", value: "Recycled Fabrics" }
      ],
      audience: [
        { id: "pat-aud-1", value: "Climate Activists" },
        { id: "pat-aud-2", value: "Wilderness Explorers" }
      ],
      values: [
        { id: "pat-val-1", value: "Radical Preservation" },
        { id: "pat-val-2", value: "Anti-Consumerism" }
      ],
      differentiators: [
        { id: "pat-diff-1", value: "Worn Wear Repair Program" },
        { id: "pat-diff-2", value: "Self-imposed 1% Earth Tax" }
      ],
      elevatorPitch: [
        { id: "pat-pitch-1", value: "We build highly functional gear to save our home planet." }
      ]
    },
    phase2: {
      soWhat: "Buying our gear isn't a simple act of commercial consumption; it becomes an active statement of environmental stewardship.",
      enemy: "Planned obsolescence, rapid consumerist culture, and corporate actions that destroy natural ecosystems."
    },
    phase3: {
      whiteSpace: "Flipping the outdoor apparel marketing meta from 'man conquering nature' to 'nature surviving man'."
    },
    phase4: {
      guidingIdea: "We’re in business to save our home planet."
    },
    guidingIdeaHistory: ["We’re in business to save our home planet."],
    guidingIdeaIndex: 0
  },
  {
    id: "indie-singer",
    name: "The Messy Indie Singer",
    phase1: {
      attributes: [
        { id: "ind-attr-1", value: "Sonic Bedroom Indie-Pop" },
        { id: "ind-attr-2", value: "Raw Voice Memos" }
      ],
      audience: [
        { id: "ind-aud-1", value: "Anxious Gen-Z" },
        { id: "ind-aud-2", value: "Nostalgic Millennials" }
      ],
      values: [
        { id: "ind-val-1", value: "Radical Vulnerability" },
        { id: "ind-val-2", value: "Physical Imperfection" }
      ],
      differentiators: [
        { id: "ind-diff-1", value: "Turning Fan Secrets into Songs" }
      ],
      elevatorPitch: [
        { id: "ind-pitch-1", value: "A bedroom singer writing cinematic diary tracks to comfort lonely hearts." }
      ]
    },
    phase2: {
      soWhat: "Listening to her music feels like reading her personal diary, realizing your most embarrassing, isolated secrets are shared.",
      enemy: "The highly curated, plastic, hyper-polished aesthetic of flawless mainstream pop icons."
    },
    phase3: {
      whiteSpace: "Trading the far-away pop star pedestal to sit right on the cold floor next to the listener in their own room."
    },
    phase4: {
      guidingIdea: "Your messy, late-night thoughts, set to music."
    },
    guidingIdeaHistory: ["Your messy, late-night thoughts, set to music."],
    guidingIdeaIndex: 0
  }
];

export default function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('brand_projects_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(p => {
          const loadedPhase1 = p.phase1 || {};
          const convertToItemArray = (fieldVal) => {
            if (Array.isArray(fieldVal)) return fieldVal;
            if (typeof fieldVal === 'string' && fieldVal.trim()) {
              return fieldVal.split(',').map((val, i) => ({
                id: `item-${i}-${Date.now()}`,
                value: val.trim()
              }));
            }
            return [];
          };

          return {
            ...p,
            phase1: {
              attributes: convertToItemArray(loadedPhase1.attributes),
              audience: convertToItemArray(loadedPhase1.audience),
              values: convertToItemArray(loadedPhase1.values),
              differentiators: convertToItemArray(loadedPhase1.differentiators),
              elevatorPitch: convertToItemArray(loadedPhase1.elevatorPitch)
            },
            guidingIdeaHistory: p.guidingIdeaHistory || [p.phase4?.guidingIdea || ""],
            guidingIdeaIndex: typeof p.guidingIdeaIndex === 'number' ? p.guidingIdeaIndex : 0
          };
        });
      } catch (e) {
        console.error("Local storage sync mismatch. Restoring defaults.", e);
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem('brand_active_project_id_v5') || "patagonia";
  });

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('brand_active_tab_v5');
    return savedTab ? parseInt(savedTab, 10) : 1;
  });

  const [activeSubTab, setActiveSubTab] = useState(() => {
    return localStorage.getItem('brand_active_subtab_v5') || "attributes";
  });

  const [tagInput, setTagInput] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStepMessage, setAiStepMessage] = useState("");
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [lastSaved, setLastSaved] = useState("");

  useEffect(() => {
    localStorage.setItem('brand_projects_v5', JSON.stringify(projects));
    const now = new Date();
    setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('brand_active_project_id_v5', activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem('brand_active_tab_v5', activeTab.toString());
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('brand_active_subtab_v5', activeSubTab);
  }, [activeSubTab]);

  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0] || INITIAL_PROJECTS[0];

  const getCompiledIngredientsText = (key) => {
    const list = currentProject.phase1?.[key] || [];
    return list.map(item => item.value).filter(Boolean).join(", ");
  };

  // Lexical enhancement dictionary that intercepts raw/low-skill vocabulary 
  // and transforms it into premium, agency-grade strategic expressions.
  const elevateStrategicLanguage = (text, fallback = "uncompromising quality") => {
    if (!text || text.trim().length === 0) return fallback;

    const thesaurus = {
      "nice": "exquisite",
      "good": "exceptional",
      "cheap": "democratically accessible",
      "low price": "accessible",
      "cool": "culturally vanguard",
      "trendy": "culturally resonant",
      "sad": "introspective",
      "lonely": "emotionally isolated",
      "happy": "euphoric",
      "fast": "frictionless",
      "easy": "seamless",
      "clothes": "textiles",
      "clothing": "textile statements",
      "makeup": "aesthetic self-expression",
      "cosmetics": "dermatological self-expression",
      "food": "sustenance",
      "green": "ecologically regenerative",
      "eco": "environmentally conscious",
      "eco friendly": "nature-positive",
      "smart": "intelligent",
      "simple": "minimalist",
      "quality": "meticulously engineered",
      "different": "defiantly unique",
      "new": "pioneering",
      "clean": "pristine",
      "strong": "unyielding",
      "real": "authentic",
      "best": "premium tier",
      "boring": "generic",
      "lazy": "friction-free",
      "hard": "rigorous",
      "helpful": "transformational",
      "safe": "sacrosanct",
      "fun": "immersive",
      "kids": "adolescents",
      "teens": "emerging generations",
      "people": "discerning individuals",
      "users": "practitioners"
    };

    let cleaned = text.trim();
    // Replace phrases first
    Object.keys(thesaurus).forEach(key => {
      if (key.includes(" ")) {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        cleaned = cleaned.replace(regex, thesaurus[key]);
      }
    });

    // Replace individual words
    let words = cleaned.split(/\s+/);
    let elevatedWords = words.map(word => {
      const punctuationRemoved = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
      if (thesaurus[punctuationRemoved]) {
        return word.replace(new RegExp(punctuationRemoved, 'i'), thesaurus[punctuationRemoved]);
      }
      return word;
    });

    return elevatedWords.join(" ");
  };

  const copyText = (text, id) => {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Copy event failed', err);
    }
    document.body.removeChild(textArea);
  };

  const copyEntireDocument = () => {
    const docText = `STRATEGIC BRAND BLUEPRINT: ${currentProject.name || "Untitled Strategy"}

GUIDING IDEA (NORTH STAR):
"${currentProject.phase4?.guidingIdea || "Not yet defined"}"

01. INGREDIENT EXTRACTION
- Attributes: ${getCompiledIngredientsText('attributes') || "Unspecified"}
- Audience Persona: ${getCompiledIngredientsText('audience') || "Unspecified"}
- Core Values: ${getCompiledIngredientsText('values') || "Unspecified"}
- Strategic Differentiators: ${getCompiledIngredientsText('differentiators') || "Unspecified"}
- Elevator Pitch: ${getCompiledIngredientsText('elevatorPitch') || "Unspecified"}

02. INSIGHT FRICTIONS
- The Real "So What?" Benefit: ${currentProject.phase2?.soWhat || "Unspecified"}
- The Structural Enemy: ${currentProject.phase2?.enemy || "Unspecified"}

03. SCOUTING ALIGNMENT
- Uncontested White Space Target: ${currentProject.phase3?.whiteSpace || "Unspecified"}`;

    copyText(docText, 'entire-doc');
  };

  // Printable PDF generator that opens a beautifully typeset, light-theme A4 layout in print preview
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    const documentTitle = currentProject.name || "Untitled Strategy";
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle} - Strategic Brand Blueprint</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              color: #1c1917;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .serif-title {
              font-family: 'Playfair Display', serif;
            }
            @page {
              size: A4;
              margin: 20mm;
            }
            @media print {
              body {
                background-color: #ffffff;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body class="p-4 sm:p-8 max-w-4xl mx-auto">
          <!-- Control bar inside preview window (hidden during printing) -->
          <div class="no-print flex justify-between items-center bg-stone-100 border border-stone-200 rounded-xl p-4 mb-8">
            <span class="text-xs font-semibold text-stone-600">📄 PDF Print Preview (Save to PDF using your browser's Print dialog)</span>
            <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded shadow transition">
              Print / Save PDF
            </button>
          </div>

          <!-- Document Header -->
          <div class="flex justify-between items-end border-b-2 border-stone-800 pb-6 mb-8">
            <div>
              <span class="text-xs font-mono uppercase tracking-widest text-stone-500">Brand Strategic Blueprint</span>
              <h1 class="serif-title text-4xl font-bold text-stone-950 mt-1">${documentTitle}</h1>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono uppercase tracking-widest text-stone-500">Platform Blueprint</span>
              <p class="text-sm font-semibold text-stone-800 mt-0.5">${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <!-- Guiding Idea (Primary Callout) -->
          <div class="bg-indigo-50/50 border border-indigo-100 p-8 rounded-2xl mb-8">
            <span class="text-[10px] font-mono text-indigo-700 uppercase tracking-widest font-bold block mb-2">GUIDING IDEA (THE NORTH STAR)</span>
            <p class="serif-title text-2xl italic leading-relaxed text-indigo-950">
              “${currentProject.phase4?.guidingIdea || "Not yet defined"}”
            </p>
          </div>

          <!-- Strategic Details Grid -->
          <div class="space-y-8">
            
            <!-- Phase 1 -->
            <div>
              <h2 class="text-xs font-mono uppercase tracking-wider text-stone-400 border-b border-stone-200 pb-2 mb-4">01. Ingredient Extraction</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span class="text-xs font-mono uppercase text-stone-500 block">Attributes</span>
                  <p class="text-sm text-stone-800 mt-1 font-medium">${getCompiledIngredientsText('attributes') || "Not specified"}</p>
                </div>
                <div>
                  <span class="text-xs font-mono uppercase text-stone-500 block">Audience Persona</span>
                  <p class="text-sm text-stone-800 mt-1 font-medium">${getCompiledIngredientsText('audience') || "Not specified"}</p>
                </div>
                <div>
                  <span class="text-xs font-mono uppercase text-stone-500 block">Core Values</span>
                  <p class="text-sm text-stone-800 mt-1 font-medium">${getCompiledIngredientsText('values') || "Not specified"}</p>
                </div>
                <div>
                  <span class="text-xs font-mono uppercase text-stone-500 block">Strategic Differentiators</span>
                  <p class="text-sm text-stone-800 mt-1 font-medium">${getCompiledIngredientsText('differentiators') || "Not specified"}</p>
                </div>
              </div>
              <div class="mt-4">
                <span class="text-xs font-mono uppercase text-stone-500 block">Elevator Pitch</span>
                <p class="text-sm text-stone-800 mt-1 font-medium">${getCompiledIngredientsText('elevatorPitch') || "Not specified"}</p>
              </div>
            </div>

            <!-- Phase 2 -->
            <div>
              <h2 class="text-xs font-mono uppercase tracking-wider text-stone-400 border-b border-stone-200 pb-2 mb-4">02. Insight Frictions</h2>
              <div class="space-y-4">
                <div>
                  <span class="text-xs font-mono uppercase text-stone-500 block">The Real "So What?" Benefit</span>
                  <p class="text-sm text-stone-800 mt-1 leading-relaxed">${currentProject.phase2?.soWhat || "Not specified"}</p>
                </div>
                <div>
                  <span class="text-xs font-mono uppercase text-stone-500 block">The Structural Enemy / Status Quo</span>
                  <p class="text-sm text-stone-800 mt-1 leading-relaxed font-semibold text-red-900">${currentProject.phase2?.enemy || "Not specified"}</p>
                </div>
              </div>
            </div>

            <!-- Phase 3 -->
            <div>
              <h2 class="text-xs font-mono uppercase tracking-wider text-stone-400 border-b border-stone-200 pb-2 mb-4">03. Scouting Alignment</h2>
              <div>
                <span class="text-xs font-mono uppercase text-stone-500 block">Uncontested White Space Target</span>
                <p class="text-sm text-stone-800 mt-1 leading-relaxed">${currentProject.phase3?.whiteSpace || "Not specified"}</p>
              </div>
            </div>

          </div>

          <!-- Document Footer -->
          <div class="border-t border-stone-200 mt-16 pt-6 flex justify-between text-xs font-mono text-stone-400">
            <span>SECURED BRAND INTELLECTUAL PROPERTY</span>
            <span>VERIFIED BY IDEA ARCHITECT</span>
          </div>

          <script>
            // Auto trigger print dialogue on page display
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleAddTag = (category, valueText) => {
    const cleanValue = valueText.trim();
    if (!cleanValue) return;

    setProjects(prev => prev.map(proj => {
      if (proj.id === activeProjectId) {
        const currentTags = proj.phase1[category] || [];
        // Prevent duplicate values in the same category
        if (currentTags.some(tag => tag.value.toLowerCase() === cleanValue.toLowerCase())) {
          return proj;
        }
        return {
          ...proj,
          phase1: {
            ...proj.phase1,
            [category]: [...currentTags, { id: `tag-${Date.now()}-${Math.random()}`, value: cleanValue }]
          }
        };
      }
      return proj;
    }));
  };

  const handleDeleteTag = (category, tagId) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === activeProjectId) {
        const currentTags = proj.phase1[category] || [];
        return {
          ...proj,
          phase1: {
            ...proj.phase1,
            [category]: currentTags.filter(tag => tag.id !== tagId)
          }
        };
      }
      return proj;
    }));
  };

  const handleFieldChange = (phaseKey, fieldKey, value) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === activeProjectId) {
        let extraFields = {};
        
        if (phaseKey === "phase4" && fieldKey === "guidingIdea") {
          const history = [...(proj.guidingIdeaHistory || [proj.phase4?.guidingIdea || ""])];
          const currentIndex = typeof proj.guidingIdeaIndex === 'number' ? proj.guidingIdeaIndex : 0;
          history[currentIndex] = value;
          extraFields = {
            guidingIdeaHistory: history
          };
        }

        return {
          ...proj,
          [phaseKey]: {
            ...proj[phaseKey],
            [fieldKey]: value
          },
          ...extraFields
        };
      }
      return proj;
    }));
  };

  const handleProjectNameChange = (name) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === activeProjectId) {
        return { ...proj, name };
      }
      return proj;
    }));
  };

  const createNewProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj = {
      id: newId,
      name: "New Brand Strategy",
      phase1: {
        attributes: [],
        audience: [],
        values: [],
        differentiators: [],
        elevatorPitch: []
      },
      phase2: { soWhat: "", enemy: "" },
      phase3: { whiteSpace: "" },
      phase4: { guidingIdea: "" },
      guidingIdeaHistory: [""],
      guidingIdeaIndex: 0
    };
    
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newId);
    setActiveTab(1);
    setActiveSubTab("attributes");
  };

  const deleteCurrentProject = () => {
    if (projects.length <= 1) return;
    const index = projects.findIndex(proj => proj.id === activeProjectId);
    const updated = projects.filter(proj => proj.id !== activeProjectId);
    setProjects(updated);
    const fallbackIndex = index === 0 ? 0 : index - 1;
    const fallbackProjId = updated[fallbackIndex].id;
    setActiveProjectId(fallbackProjId);
    setActiveSubTab("attributes");
  };

  const handleAISynthesis = () => {
    setAiLoading(true);
    const steps = [
      "Analyzing target audience vulnerabilities...",
      "Extracting and elevating simple descriptors into premium strategic pillars...",
      "Scouting unmapped systemic friction...",
      "Applying creative stylistic modifiers...",
      "Forging highly polished structural mantra..."
    ];

    let currentStepIndex = 0;
    setAiStepMessage(steps[0]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setAiStepMessage(steps[currentStepIndex]);
      } else {
        clearInterval(interval);
        
        // Elevate language of ingredients to make results smarter, even with low skill input
        const rawValueText = getCompiledIngredientsText('values');
        const elevatedVal = elevateStrategicLanguage(rawValueText, "uncompromising authenticity");

        const rawAudienceText = getCompiledIngredientsText('audience');
        const elevatedAud = elevateStrategicLanguage(rawAudienceText, "discerning seekers");

        const rawEnemyText = currentProject.phase2?.enemy || "";
        const elevatedEnemy = elevateStrategicLanguage(rawEnemyText, "homogenized market mediocrity");

        const val = elevatedVal.split(',')[0].trim();
        const aud = elevatedAud.split(',')[0].trim();
        const enemy = elevatedEnemy.split(',')[0].trim();

        const p = (aiPrompt || "").toLowerCase();
        let customAddition = "";
        if (aiPrompt && aiPrompt.length > 2 && !p.includes("short") && !p.includes("punchy") && !p.includes("poetic") && !p.includes("rebellious") && !p.includes("premium")) {
          const cleanWords = aiPrompt.replace(/make it|sound|more|focus on|include|the word/gi, "").trim();
          if (cleanWords.length > 2) {
            customAddition = elevateStrategicLanguage(cleanWords);
          }
        }

        let syntheticIdea = "";
        if (p.includes("short") || p.includes("punchy") || p.includes("minimal")) {
          const shortOptions = [
            `Defying ${enemy} with pure ${val}.`,
            `Unapologetic ${val}.`,
            `${val} over ${enemy}.`,
            `Intentionally built ${val} for ${aud}.`
          ];
          syntheticIdea = customAddition ? `A core of ${val}: ${customAddition}.` : shortOptions[Math.floor(Math.random() * shortOptions.length)];
        } else if (p.includes("rebel") || p.includes("fight") || p.includes("bold") || p.includes("defy")) {
          syntheticIdea = `An unyielding rebellion of ${val} engineered to completely dismantle ${enemy} for ${aud}.`;
        } else if (p.includes("poetic") || p.includes("soul") || p.includes("deep") || p.includes("emotional")) {
          syntheticIdea = `A quiet, cinematic sanctuary of ${val} designed to offer shelter to ${aud} from ${enemy}.`;
        } else if (p.includes("premium") || p.includes("luxury") || p.includes("high-end")) {
          syntheticIdea = `The absolute pinnacle of ${val}—handcrafted for ${aud} who refuse to tolerate the weight of ${enemy}.`;
        } else if (customAddition) {
          syntheticIdea = `Pioneering an elevated realm of ${val} centered around ${customAddition}, empowering ${aud} against ${enemy}.`;
        } else {
          const templates = [
            `Reclaiming true ${val} for ${aud} by systematically deconstructing ${enemy}.`,
            `The raw, uncompromised antidote to ${enemy}—crafted exclusively for ${aud}.`,
            `Refusing the parameters of ${enemy} to design an uncontested space where ${aud} experience absolute ${val}.`,
            `Engineering the future of ${val}, rendering ${enemy} completely obsolete for ${aud}.`,
            `Democratizing ${val} for every ${aud} tired of navigating the patterns of ${enemy}.`,
            `Elevating the core standard of ${val} so that ${aud} are no longer trapped by ${enemy}.`,
            `A sanctuary of ${val} created specifically for ${aud} to transcend ${enemy}.`,
            `The bold, beautiful rebellion of ${val} against ${enemy}, meticulously customized for ${aud}.`
          ];
          const randomIndex = Math.floor(Math.random() * templates.length);
          syntheticIdea = templates[randomIndex];
        }

        // Capitalize sentence start
        syntheticIdea = syntheticIdea.charAt(0).toUpperCase() + syntheticIdea.slice(1);

        setProjects(prev => prev.map(proj => {
          if (proj.id === activeProjectId) {
            const currentHistory = proj.guidingIdeaHistory || [proj.phase4?.guidingIdea || ""];
            const newHistory = [...currentHistory, syntheticIdea];
            const newIndex = newHistory.length - 1;

            return {
              ...proj,
              phase4: {
                ...proj.phase4,
                guidingIdea: syntheticIdea
              },
              guidingIdeaHistory: newHistory,
              guidingIdeaIndex: newIndex
            };
          }
          return proj;
        }));

        setAiLoading(false);
        setSuccessAnimation(true);
        setTimeout(() => setSuccessAnimation(false), 2000);
      }
    }, 200);
  };

  const navigateHistory = (direction) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === activeProjectId) {
        const history = proj.guidingIdeaHistory || [proj.phase4?.guidingIdea || ""];
        const currentIndex = typeof proj.guidingIdeaIndex === 'number' ? proj.guidingIdeaIndex : 0;
        let newIndex = currentIndex;

        if (direction === 'back') {
          newIndex = Math.max(0, currentIndex - 1);
        } else if (direction === 'forward') {
          newIndex = Math.min(history.length - 1, currentIndex + 1);
        }

        return {
          ...proj,
          phase4: {
            ...proj.phase4,
            guidingIdea: history[newIndex] || ""
          },
          guidingIdeaIndex: newIndex
        };
      }
      return proj;
    }));
  };

  const exportProjectJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentProject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}-strategy.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const CopyIconBtn = ({ text, id }) => (
    <button
      onClick={() => copyText(text, id)}
      className="ml-2 inline-flex items-center text-zinc-600 hover:text-zinc-350 transition focus:outline-none shrink-0"
      title="Copy to clipboard"
    >
      {copiedId === id ? (
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  );

  const HistoryNav = () => {
    const history = currentProject.guidingIdeaHistory || [currentProject.phase4?.guidingIdea || ""];
    const index = typeof currentProject.guidingIdeaIndex === 'number' ? currentProject.guidingIdeaIndex : 0;
    
    return (
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-mono text-zinc-500">
          {index + 1} / {history.length}
        </span>
        <div className="flex items-center bg-zinc-950 rounded border border-zinc-850 p-0.5">
          <button
            onClick={() => navigateHistory('back')}
            disabled={index <= 0}
            className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 transition"
            title="Previous idea"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateHistory('forward')}
            disabled={index >= history.length - 1}
            className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 transition"
            title="Next idea"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const INGREDIENT_TABS = [
    { id: "attributes", label: "Attributes", placeholder: "e.g. Handmade, Organic, Stoneware..." },
    { id: "audience", label: "Audience", placeholder: "e.g. Design obsessives, Minimalists, Collectors..." },
    { id: "values", label: "Values", placeholder: "e.g. Uncompromising artistry, Longevity..." },
    { id: "differentiators", label: "Differentiators", placeholder: "e.g. Numbered signature runs, Free replacement..." },
    { id: "elevatorPitch", label: "Elevator Pitch", placeholder: "e.g. Timeless ceramics providing quiet focus..." }
  ];

  const currentCategoryTags = currentProject.phase1?.[activeSubTab] || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-violet-500/30 selection:text-violet-300">
      
      {/* Header Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-violet-400/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white font-sans">IDEA ARCHITECT</h1>
              <div className="flex items-center space-x-2 mt-0.5">
                <p className="text-xs text-zinc-500 font-mono">GUIDING IDEA WORKSPACE v5.1</p>
                <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                <div className="flex items-center space-x-1" title={`Autosaved last at ${lastSaved || "recently"}`}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">Local Sync Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <select
              value={activeProjectId}
              onChange={(e) => {
                const projId = e.target.value;
                setActiveProjectId(projId);
                setActiveTab(1);
                setActiveSubTab("attributes");
              }}
              className="bg-zinc-900 border border-zinc-850 text-zinc-200 text-sm rounded-lg focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 p-2 px-3 transition-all cursor-pointer font-sans"
            >
              {projects.map(proj => (
                <option key={proj.id} value={proj.id}>{proj.name}</option>
              ))}
            </select>
            
            <button
              onClick={createNewProject}
              className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 text-xs font-medium transition"
              title="Create New Strategy Blueprint"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New</span>
            </button>
            
            <button
              onClick={exportProjectJSON}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
              title="Export Brand Blueprint"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            <button
              onClick={deleteCurrentProject}
              disabled={projects.length <= 1}
              className="p-2 bg-zinc-950 hover:bg-red-950/30 text-zinc-600 hover:text-red-400 rounded-lg border border-zinc-900 hover:border-red-900/30 transition disabled:opacity-30 disabled:hover:bg-transparent"
              title="Delete Strategy"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Panel */}
          <div className="lg:col-span-7 bg-zinc-900/40 rounded-2xl border border-zinc-900 p-6 shadow-sm">
            
            {/* Title Editing Section */}
            <div className="mb-8 border-b border-zinc-900 pb-6">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">Strategy Workspace</label>
              <input
                type="text"
                value={currentProject.name}
                onChange={(e) => handleProjectNameChange(e.target.value)}
                className="bg-transparent text-2xl font-semibold text-white focus:outline-none focus:ring-0 border-b border-transparent focus:border-zinc-800 w-full transition pb-1"
                placeholder="Name your brand..."
              />
            </div>

            {/* Steps Navigation Wizard */}
            <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl mb-8 border border-zinc-900/60">
              {[
                { step: 1, label: "Ingredients", short: "01" },
                { step: 2, label: "Insights", short: "02" },
                { step: 3, label: "Scouting", short: "03" },
                { step: 4, label: "The Idea", short: "04" }
              ].map(tab => (
                <button
                  key={tab.step}
                  onClick={() => setActiveTab(tab.step)}
                  className={`py-2.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                    activeTab === tab.step
                      ? "bg-zinc-900 text-white shadow-sm border border-zinc-800/80"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500">{tab.short}</span>
                  <span className="text-xs font-medium mt-0.5">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Stage Area */}
            <div className="space-y-6">
              
              {/* STEP 1: Ingredients Tag Workspace */}
              {activeTab === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-semibold text-zinc-300">Phase 1: Raw Strategic Ingredients</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Type your strategic points below and press <span className="font-mono text-violet-400 bg-violet-950/40 px-1 py-0.5 rounded">Enter</span> to turn each thought into a structured strategic chip.
                    </p>
                  </div>

                  {/* Ingredient Category Selector */}
                  <div className="flex overflow-x-auto space-x-1 p-1 bg-zinc-950 rounded-lg border border-zinc-900/80 scrollbar-none">
                    {INGREDIENT_TABS.map((tab) => {
                      const isActive = activeSubTab === tab.id;
                      const hasContent = (currentProject.phase1?.[tab.id] || []).length > 0;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSubTab(tab.id)}
                          className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium transition-all relative whitespace-nowrap ${
                            isActive
                              ? "bg-zinc-900 text-white border border-zinc-800/80"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {tab.label}
                          {hasContent && (
                            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fluent Tags Interactive Container */}
                  <div className="bg-zinc-950/20 p-5 rounded-xl border border-zinc-900/60 min-h-[220px] flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      <label className="block text-[10px] font-mono text-violet-400/80 uppercase tracking-wider">
                        Brainstorming: {INGREDIENT_TABS.find(t => t.id === activeSubTab)?.label}
                      </label>

                      {/* Fluent input area */}
                      <div className="relative">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(activeSubTab, tagInput);
                              setTagInput("");
                            }
                          }}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-violet-500/50 rounded-xl p-4 pr-16 text-sm text-zinc-200 placeholder-zinc-750 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                          placeholder={INGREDIENT_TABS.find(t => t.id === activeSubTab)?.placeholder || "Type and press Enter..."}
                        />
                        <button
                          onClick={() => {
                            handleAddTag(activeSubTab, tagInput);
                            setTagInput("");
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded border border-zinc-850"
                        >
                          Add
                        </button>
                      </div>

                      {/* Displaying generated Tag Chips */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {currentCategoryTags.length > 0 ? (
                          currentCategoryTags.map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center space-x-1.5 bg-violet-950/30 border border-violet-500/30 text-violet-200 px-3 py-1.5 rounded-lg text-xs transition duration-150 animate-fadeIn"
                            >
                              <span>{tag.value}</span>
                              <button
                                onClick={() => handleDeleteTag(activeSubTab, tag.id)}
                                className="text-violet-400 hover:text-red-400 font-bold ml-1 text-sm focus:outline-none focus:text-red-400"
                                title="Remove item"
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-zinc-650 italic text-xs py-4">
                            No items added yet. Type your first point above and press enter.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick navigation inside category sets */}
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-900/40 mt-4">
                      <button
                        onClick={() => {
                          const idx = INGREDIENT_TABS.findIndex(t => t.id === activeSubTab);
                          if (idx > 0) {
                            setActiveSubTab(INGREDIENT_TABS[idx - 1].id);
                          }
                        }}
                        disabled={activeSubTab === INGREDIENT_TABS[0].id}
                        className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 disabled:opacity-25 disabled:hover:text-zinc-500 transition-all"
                      >
                        {'\u2190'} Previous Category
                      </button>
                      <button
                        onClick={() => {
                          const idx = INGREDIENT_TABS.findIndex(t => t.id === activeSubTab);
                          if (idx < INGREDIENT_TABS.length - 1) {
                            setActiveSubTab(INGREDIENT_TABS[idx + 1].id);
                          }
                        }}
                        disabled={activeSubTab === INGREDIENT_TABS[INGREDIENT_TABS.length - 1].id}
                        className="text-[11px] font-mono text-violet-400 hover:text-violet-300 disabled:opacity-25 disabled:hover:text-violet-400 transition-all font-medium"
                      >
                        Next Category {'\u2192'}
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: Insights */}
              {activeTab === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-semibold text-zinc-300">Phase 2: Insight Extraction Filter</h3>
                    <p className="text-xs text-zinc-500 mt-1">Peel back surface attributes to extract deeper emotional motivations and structural market friction.</p>
                  </div>

                  <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                    <div className="flex items-start space-x-3">
                      <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/30 mt-0.5">
                        <span className="text-[10px] text-indigo-400 font-semibold">?</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-zinc-300">The "So What?" Drill Down</span>
                        <p className="text-xs text-zinc-500">
                          Run an attribute through the logical stack: 'We make durable ceramics.' {'\u2192'} So what? {'\u2192'} 'They don't chip or degrade over generations.' {'\u2192'} So what? {'\u2192'} 'Our pieces carry family histories.' Extract the highest tier of meaning.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wide">The Real "So What?" Benefit</label>
                    <textarea
                      value={currentProject.phase2?.soWhat || ""}
                      onChange={(e) => handleFieldChange("phase2", "soWhat", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500/50 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 h-24 resize-none"
                      placeholder="What is the deepest emotional or functional truth of using your product?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wide">The Structural Enemy / Status Quo</label>
                    <textarea
                      value={currentProject.phase2?.enemy || ""}
                      onChange={(e) => handleFieldChange("phase2", "enemy", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500/50 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 h-24 resize-none"
                      placeholder="What old system, expectation, or frustration is your brand actively rebelling against?"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Scouting Alignment */}
              {activeTab === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-semibold text-zinc-300">Phase 3: Scouting Alignment</h3>
                    <p className="text-xs text-zinc-500 mt-1">Locate the uncontested white space where competitors aren't looking or talking.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wide">Uncontested White Space Target</label>
                    <textarea
                      value={currentProject.phase3?.whiteSpace || ""}
                      onChange={(e) => handleFieldChange("phase3", "whiteSpace", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-violet-500/50 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-750 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 h-32 resize-none"
                      placeholder="Define the open space in the market landscape. What is the unique position that only your brand can fill?"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Synthesis & Guiding Idea Generation */}
              {activeTab === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-semibold text-zinc-300">Phase 4: Synthesis & Guiding Idea</h3>
                    <p className="text-xs text-zinc-500 mt-1">Forge your findings into a single, highly refined strategic creative position statement.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wide font-medium">Polished Guiding Idea / Mantra</label>
                      <HistoryNav />
                    </div>
                    <textarea
                      value={currentProject.phase4?.guidingIdea || ""}
                      onChange={(e) => handleFieldChange("phase4", "guidingIdea", e.target.value)}
                      className={`w-full bg-zinc-950 border ${
                        successAnimation ? "border-emerald-500 focus:ring-emerald-500/20 text-emerald-200" : "border-violet-500/50 focus:ring-violet-500/20 text-violet-100"
                      } rounded-xl p-4 text-lg font-medium placeholder-zinc-750 focus:outline-none focus:ring-1 transition-all duration-500 h-32 resize-none`}
                      placeholder="Your brand's strategic North Star in a punchy line or brief sentence..."
                    />
                  </div>

                  {/* AI Synthesizer Unit */}
                  <div className="bg-zinc-950 rounded-xl border border-zinc-900 p-5 mt-6 relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
                    
                    {/* Prompt Controls */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          Creative Direction & Style Modifiers (Prompt)
                        </label>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                          Lexical Elevation Active
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g. make it punchy, rebellious, poetic, focus on longevity..."
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-500/50 rounded-lg py-2 px-3 text-xs text-zinc-100 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all pr-8"
                        />
                        {aiPrompt && (
                          <button
                            onClick={() => setAiPrompt("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm font-bold"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          { label: "⚡ Punchy", value: "make it very short and punchy" },
                          { label: "🔥 Rebellious", value: "make it rebellious and bold" },
                          { label: "🌱 Poetic", value: "make it poetic and emotional" },
                          { label: "💼 Premium", value: "make it premium and elite" }
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => setAiPrompt(preset.value)}
                            className={`px-2 py-1 rounded text-[10px] font-mono transition ${
                              aiPrompt === preset.value
                                ? "bg-violet-950 text-violet-300 border border-violet-500/40"
                                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-zinc-900/60 pt-4">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Synthesizer Agent</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Combine steps 1-3 with your custom direction prompt to generate infinite distinct ideas.</p>
                      </div>
                      
                      <button
                        onClick={handleAISynthesis}
                        disabled={aiLoading}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition flex items-center space-x-2 shrink-0 ${
                          aiLoading
                            ? "bg-zinc-900 text-zinc-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/10"
                        }`}
                      >
                        {aiLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span>Distill Guiding Idea</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Progress notifications */}
                    {aiLoading && (
                      <div className="mt-4 pt-4 border-t border-zinc-900/60 flex items-center space-x-2 animate-pulse">
                        <span className="flex h-1.5 w-1.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <p className="text-[11px] font-mono text-zinc-400">{aiStepMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stepper bottom navigation actions */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-900 font-sans">
              <button
                onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
                disabled={activeTab === 1}
                className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-lg border transition ${
                  activeTab === 1
                    ? "border-zinc-900/40 text-zinc-700 cursor-not-allowed"
                    : "border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900/30"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Previous Step</span>
              </button>

              <button
                onClick={() => setActiveTab(prev => Math.min(4, prev + 1))}
                disabled={activeTab === 4}
                className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-lg border transition ${
                  activeTab === 4
                    ? "border-zinc-900/40 text-zinc-700 cursor-not-allowed"
                    : "border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900/30"
                }`}
              >
                <span>Next Step</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>

          {/* Right Column: Live Presentation Preview Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800/85 shadow-2xl p-6 relative overflow-hidden transition-all duration-300">
              
              {/* Backlight aesthetics */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/5 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none"></div>

              {/* Blueprint Heading block */}
              <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-6">
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Strategic Brand Blueprint</h2>
                  <p className="text-[10px] font-mono text-zinc-650 uppercase mt-0.5">MANTRA & POSITION CANVASES</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrintPDF}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono bg-zinc-950/60 border-zinc-800 text-violet-400 hover:text-violet-300 hover:border-violet-500/40 transition focus:outline-none"
                    title="Export styled print-ready A4 PDF Document"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>PDF EXPORT</span>
                  </button>
                  
                  <button
                    onClick={copyEntireDocument}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono transition focus:outline-none ${
                      copiedId === 'entire-doc'
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    {copiedId === 'entire-doc' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>COPIED ALL!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>COPY TEXT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Subject metadata */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">SUBJECT BRAND</span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">{currentProject.name || "Untitled Strategy"}</h3>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Active Sync Enabled"></div>
              </div>

              {/* Blueprint Items */}
              <div className="space-y-6 text-xs font-sans text-zinc-300 overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin">
                
                {/* Core Idea display card */}
                <div className={`p-4 rounded-xl border transition-all duration-500 relative ${
                  successAnimation 
                    ? "bg-emerald-950/20 border-emerald-500/50 text-emerald-200 ring-2 ring-emerald-500/10 scale-[1.01]" 
                    : "bg-zinc-950/80 border-violet-500/25 text-zinc-100"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-violet-400/80 uppercase tracking-widest font-semibold block">GUIDING IDEA (NORTH STAR)</span>
                    <div className="flex items-center space-x-1.5 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-850">
                      <HistoryNav />
                      <CopyIconBtn text={currentProject.phase4?.guidingIdea || ""} id="card-guiding-idea" />
                    </div>
                  </div>
                  {currentProject.phase4?.guidingIdea ? (
                    <p className="text-sm font-medium italic leading-relaxed text-zinc-250 font-serif">
                      “{currentProject.phase4.guidingIdea}”
                    </p>
                  ) : (
                    <span className="text-zinc-650 italic block py-1 font-mono text-[11px]">[Design a Guiding Idea or run Synthesis to discover]</span>
                  )}
                </div>

                {/* Section 1: Ingredients Summary */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-850 pb-1.5 font-bold">01. Ingredient Extraction</h4>
                  
                  {/* Attributes */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      Attributes:
                      <CopyIconBtn text={getCompiledIngredientsText('attributes')} id="card-attr" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {getCompiledIngredientsText('attributes') || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>

                  {/* Audience */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      Audience Persona:
                      <CopyIconBtn text={getCompiledIngredientsText('audience')} id="card-aud" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {getCompiledIngredientsText('audience') || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>

                  {/* Values */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      Core Values:
                      <CopyIconBtn text={getCompiledIngredientsText('values')} id="card-val" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {getCompiledIngredientsText('values') || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>

                  {/* Differentiators */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      Strategic Differentiators:
                      <CopyIconBtn text={getCompiledIngredientsText('differentiators')} id="card-diff" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {getCompiledIngredientsText('differentiators') || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>

                  {/* Elevator Pitch */}
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      Elevator Pitch:
                      <CopyIconBtn text={getCompiledIngredientsText('elevatorPitch')} id="card-pitch" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {getCompiledIngredientsText('elevatorPitch') || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>
                </div>

                {/* Section 2: Insights Summary */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-850 pb-1.5 font-bold">02. Insight Frictions</h4>
                  
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      The Real "So What?" Benefit:
                      <CopyIconBtn text={currentProject.phase2?.soWhat || ""} id="card-sowhat" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {currentProject.phase2?.soWhat || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      The Structural Enemy:
                      <CopyIconBtn text={currentProject.phase2?.enemy || ""} id="card-enemy" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light text-red-300/80 font-sans">
                      {currentProject.phase2?.enemy || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>
                </div>

                {/* Section 3: Scouting Summary */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-850 pb-1.5 font-bold">03. Scouting Alignment</h4>
                  
                  <div>
                    <span className="text-[10px] text-zinc-400 font-medium inline-flex items-center">
                      Uncontested White Space Target:
                      <CopyIconBtn text={currentProject.phase3?.whiteSpace || ""} id="card-whitespace" />
                    </span>
                    <p className="text-zinc-300 leading-relaxed mt-1 font-light font-sans">
                      {currentProject.phase3?.whiteSpace || <span className="text-zinc-700 italic font-mono text-[10px]">[Unspecified]</span>}
                    </p>
                  </div>
                </div>

              </div>

              {/* Aesthetic footer marker */}
              <div className="border-t border-zinc-800 pt-4 mt-8 flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span>VERIFIED ALIGNMENT</span>
                <span>SECURED CORE</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
