const toolData = [
    // PSORIASIS
    {
        id: "pasi",
        name: "Psoriasis Area and Severity Index (PASI)",
        shortName: "PASI",
        condition: ["Psoriasis", "Plaque Psoriasis"],
        purpose: "Gold standard for assessing severity of extensive plaque psoriasis and monitoring treatment response.",
        sourceType: "clinician",
        components: [
            ...['Head/Neck', 'Upper Limbs', 'Trunk', 'Lower Limbs'].map(regionName => {
                const regionMap = { 'Head/Neck': 'h', 'Upper Limbs': 'u', 'Trunk': 't', 'Lower Limbs': 'l' };
                const regionAbbr = regionMap[regionName];
                const bsaPercent = { h: 10, u: 20, t: 30, l: 40 }[regionAbbr];
                const multiplier = bsaPercent / 100;
                return {
                    id: `region_${regionAbbr}`, name: `Region: ${regionName} (${bsaPercent}%, x${multiplier})`, inputType: "group", isGridItem: true,
                    subComponents: [
                        { id: `E_${regionAbbr}`, name: "Erythema (E)", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Slight/Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Marked/Severe"}, {value:4, text:"4-Very Severe"} ], defaultValue:0 },
                        { id: `I_${regionAbbr}`, name: "Induration (I)", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Slight/Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Marked/Severe"}, {value:4, text:"4-Very Severe"} ], defaultValue:0 },
                        { id: `S_${regionAbbr}`, name: "Scaling (S)", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Slight/Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Marked/Severe"}, {value:4, text:"4-Very Severe"} ], defaultValue:0 },
                        { id: `A_${regionAbbr}`, name: "Area (A)", inputType: "select", options: [
                            {value:0, text:"0 (0%)"}, {value:1, text:"1 (1-9%)"}, {value:2, text:"2 (10-29%)"}, {value:3, text:"3 (30-49%)"}, {value:4, text:"4 (50-69%)"}, {value:5, text:"5 (70-89%)"}, {value:6, text:"6 (90-100%)"}
                        ], description: "% region affected.", defaultValue:0 },
                    ]
                };
            })
        ],
        calculate: function(inputs) {
            const multipliers = { h: 0.1, u: 0.2, t: 0.3, l: 0.4 }; 
            let totalPASIScore = 0;
            let regionalScoresOutput = {};
            ['h', 'u', 't', 'l'].forEach(regionAbbr => {
                const E = parseInt(inputs[`E_${regionAbbr}`]) || 0;
                const I = parseInt(inputs[`I_${regionAbbr}`]) || 0;
                const S = parseInt(inputs[`S_${regionAbbr}`]) || 0;
                const A = parseInt(inputs[`A_${regionAbbr}`]) || 0;
                const sumSeverity = E + I + S; // Max 12
                const regionalScore = multipliers[regionAbbr] * sumSeverity * A;
                totalPASIScore += regionalScore;
                const regionNameComp = this.components.find(c => c.id === `region_${regionAbbr}`);
                const regionFullName = regionNameComp ? regionNameComp.name.split('(')[0].replace('Region: ','').trim() : regionAbbr;
                regionalScoresOutput[regionFullName] = { E, I, S, A, sumSeverity, score: regionalScore.toFixed(2) };
            });
            return { PASI: totalPASIScore.toFixed(2), regionalScores: regionalScoresOutput };
        },
        interpret: function(results) {
            const pasi = parseFloat(results.PASI);
            let severityText = "Common bands: <10 Mild; 10-20 Moderate; >20 Severe (can vary, e.g., <5 Mild, 5-10 Mod, >10 Sev is also used).";
            let regionalDetails = "<h4>Regional Scores:</h4><ul>";
            for (const regionName in results.regionalScores) {
                const r = results.regionalScores[regionName];
                regionalDetails += `<li>${regionName}: Score ${r.score} (E:${r.E}, I:${r.I}, S:${r.S}, Severity Sum:${r.sumSeverity}, Area Score:${r.A})</li>`;
            }
            regionalDetails += "</ul>";
            return `
                <p><strong>Total PASI Score: ${results.PASI}</strong> (Range: 0-72)</p>
                ${regionalDetails}
                <div class="interpretation-guide">
                    <p><strong>Severity Interpretation:</strong> ${severityText}</p>
                    <p>Response: PASI 50, 75, 90, 100 indicate % reduction from baseline.</p>
                </div>`;
        },
        references: "Fredriksson T, Pettersson U. Dermatologica. 1978;157(4):238-44."
    },
    {
        id: "napsi",
        name: "Nail Psoriasis Severity Index (NAPSI)",
        shortName: "NAPSI",
        condition: ["Psoriasis", "Nail Disorders"],
        purpose: "Evaluates severity of psoriatic nail involvement.",
        sourceType: "clinician",
        components: [
            { 
                id: "nail_count", name: "Number of Nails Assessed", inputType: "select", 
                options: Array.from({length: 20}, (_, i) => ({value: i + 1, text: `${i+1} Nail(s)`})),
                defaultValue: 10, description: "Each nail divided into 4 quadrants."
            },
            { 
                id: "nails_input_area", name: "Nail Scores (per nail)", inputType: "dynamic_group", 
                description: "Score = # quadrants affected by ANY relevant sign (0-4 per matrix/bed).",
                item_template: { 
                    id_prefix: "nail_", name_prefix: "Nail ",
                    subComponents: [
                        { id_suffix: "_matrix", name: "Matrix Score (0-4)", inputType: "number", min:0, max:4, defaultValue:0, tooltip:"Quadrants w/ any: Pitting, Leukonychia, Red spots in lunula, Crumbling." },
                        { id_suffix: "_bed", name: "Bed Score (0-4)", inputType: "number", min:0, max:4, defaultValue:0, tooltip:"Quadrants w/ any: Onycholysis, Splinter hemorrhages, Subungual hyperkeratosis, Oil drop discoloration." }
                    ]
                },
                count_source_id: "nail_count" 
            }
        ],
        calculate: function(inputs) {
            let totalNapsiScore = 0;
            const nailCount = parseInt(inputs.nail_count) || 0;
            let perNailScores = [];
            for(let i=1; i<=nailCount; i++) {
                const matrixScore = parseInt(inputs[`nail_${i}_matrix`]) || 0;
                const bedScore = parseInt(inputs[`nail_${i}_bed`]) || 0;
                const nailTotal = matrixScore + bedScore; // Max 8 per nail
                totalNapsiScore += nailTotal;
                perNailScores.push({nail: i, matrix: matrixScore, bed: bedScore, total: nailTotal});
            }
            return { NAPSI: totalNapsiScore, perNailScores, assessedNails: nailCount };
        },
        interpret: function(results) {
            let detailStr = "<h4>Per Nail Scores:</h4><ul>";
            results.perNailScores.forEach(ns => {
                detailStr += `<li>Nail ${ns.nail}: Matrix ${ns.matrix}, Bed ${ns.bed} = Total ${ns.total}</li>`;
            });
            detailStr += "</ul>";
            return `
                <p><strong>Total NAPSI Score (for ${results.assessedNails} nails): ${results.NAPSI}</strong> (Range 0-${results.assessedNails * 8})</p>
                ${detailStr}
                <div class="interpretation-guide">
                    <p>Higher score indicates more severe nail psoriasis. No universal severity bands defined; used for tracking change.</p>
                </div>`;
        },
        references: "Rich P, Scher RK. J Am Acad Dermatol. 2003 Aug;49(2):206-12."
    },
    {
        id: "pga_psoriasis",
        name: "Physician Global Assessment (PGA) for Psoriasis",
        shortName: "PGA Psoriasis",
        condition: ["Psoriasis"],
        purpose: "Single-item clinician assessment of overall psoriasis severity.",
        sourceType: "classification", 
        components: [
            {
                id: "pga_level", name: "Select PGA Level (Example 7-Level)", inputType: "select",
                options: [ 
                    { value: 0, text: "0 - Clear" }, { value: 1, text: "1 - Almost Clear / Minimal" }, { value: 2, text: "2 - Mild" },
                    { value: 3, text: "3 - Mild to Moderate" }, { value: 4, text: "4 - Moderate" }, { value: 5, text: "5 - Moderate to Severe" }, { value: 6, text: "6 - Severe / Very Marked" }
                ],
                defaultValue: 0, description: "Based on global assessment. Scales vary."
            }
        ],
        calculate: function(inputs) {
            const selectedOption = this.components[0].options.find(o => o.value == inputs.pga_level);
            return { level: parseInt(inputs.pga_level), description: selectedOption ? selectedOption.text : "N/A" };
        },
        interpret: function(results) {
            const severity = results.description.split(' - ')[1] || results.description; // Get text after 'X - '
            return `
                <p><strong>PGA for Psoriasis: Level ${results.level} (${severity})</strong></p>
                <div class="interpretation-guide">
                    <p>Score directly reflects assessed severity. PGA 0 or 1 often a treatment goal.</p>
                </div>`;
        },
        references: "Various versions; widely used in clinical trials."
    },
     {
        id: "pssi",
        name: "Psoriasis Scalp Severity Index (PSSI)",
        shortName: "PSSI",
        condition: ["Psoriasis", "Scalp Psoriasis"],
        purpose: "Specifically assesses the severity of scalp psoriasis.",
        sourceType: "clinician",
        components: [
            { id: "pssi_erythema", name: "Scalp Erythema (E)", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Slight"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}, {value:4, text:"4-Very Severe"} ], defaultValue:0 },
            { id: "pssi_thickness", name: "Scalp Thickness (T)", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Slight"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}, {value:4, text:"4-Very Severe"} ], defaultValue:0 },
            { id: "pssi_scaling", name: "Scalp Scaling (S)", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Slight"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}, {value:4, text:"4-Very Severe"} ], defaultValue:0 },
            { id: "pssi_area", name: "Scalp Area (A)", inputType: "select", options: [ {value:0, text:"0(0%)"}, {value:1, text:"1(1-9%)"}, {value:2, text:"2(10-29%)"}, {value:3, text:"3(30-49%)"}, {value:4, text:"4(50-69%)"}, {value:5, text:"5(70-89%)"}, {value:6, text:"6(90+%)"} ], defaultValue:0, description: "% scalp area." }
        ],
        calculate: function(inputs) {
            const E = parseInt(inputs.pssi_erythema) || 0; const T = parseInt(inputs.pssi_thickness) || 0; const S = parseInt(inputs.pssi_scaling) || 0; const A = parseInt(inputs.pssi_area) || 0;
            const pssiScore = (E + T + S) * A; 
            return { PSSI_Score: pssiScore, E, T, S, A };
        },
        interpret: function(results) {
            return `
                <p><strong>PSSI Score: ${results.PSSI_Score}</strong> (Range: 0-72)</p>
                <p>(E:${results.E} + T:${results.T} + S:${results.S}) x A:${results.A}</p>
                <div class="interpretation-guide"><p>Higher score = more severe scalp psoriasis.</p></div>`;
        },
        references: "Ortonne JP, et al. J Eur Acad Dermatol Venereol. 2004;18(Suppl 2):28."
    },

    // ATOPIC DERMATITIS
    {
        id: "scorad",
        name: "SCORing Atopic Dermatitis (SCORAD)",
        shortName: "SCORAD",
        condition: ["Atopic Dermatitis"],
        purpose: "Comprehensive assessment of extent and severity of atopic dermatitis (AD).",
        sourceType: "mixed",
        components: [ 
            { id: "A_extent", name: "A: Extent (BSA %)", inputType: "number", min: 0, max: 100, defaultValue: 0, description: "Use Rule of Nines." },
            { id: "B_intensity", name: "B: Intensity (Sum 0-18)", inputType: "group", description: "Avg. intensity of 6 signs (0-3 each).",
                subComponents: [ 
                    { id: "B_erythema", name: "Erythema", inputType: "select", options: [{value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}], defaultValue: 0, isGridItem: true },
                    { id: "B_oedema", name: "Oedema/Pap.", inputType: "select", options: [{value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}], defaultValue: 0, isGridItem: true },
                    { id: "B_oozing", name: "Oozing/Crust.", inputType: "select", options: [{value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}], defaultValue: 0, isGridItem: true },
                    { id: "B_excoriations", name: "Excoriations", inputType: "select", options: [{value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}], defaultValue: 0, isGridItem: true },
                    { id: "B_lichenification", name: "Lichenification", inputType: "select", options: [{value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}], defaultValue: 0, isGridItem: true },
                    { id: "B_dryness", name: "Dryness (non-inflamed)", inputType: "select", options: [{value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"}], defaultValue: 0, isGridItem: true },
                ]
            },
            { id: "C_subjective", name: "C: Subjective (Sum 0-20)", inputType: "group", description: "Patient VAS (last 3 days/nights).",
                subComponents: [
                    { id: "C_pruritus", name: "Pruritus (0-10)", inputType: "number", min: 0, max: 10, defaultValue: 0 },
                    { id: "C_sleeplessness", name: "Sleeplessness (0-10)", inputType: "number", min: 0, max: 10, defaultValue: 0 },
                ]
            }
        ],
        calculate: function(inputs) { 
            const A = parseFloat(inputs.A_extent) || 0;
            const B_sum = (parseInt(inputs.B_erythema)||0) + (parseInt(inputs.B_oedema)||0) + (parseInt(inputs.B_oozing)||0) + (parseInt(inputs.B_excoriations)||0) + (parseInt(inputs.B_lichenification)||0) + (parseInt(inputs.B_dryness)||0);
            const C_sum = (parseFloat(inputs.C_pruritus)||0) + (parseFloat(inputs.C_sleeplessness)||0);
            const scorad = (A/5) + (7*B_sum/2) + C_sum;
            const oScorad = (A/5) + (7*B_sum/2);
            return { SCORAD: scorad.toFixed(2), oSCORAD: oScorad.toFixed(2), A_val: A, B_val: B_sum, C_val: C_sum };
        },
        interpret: function(results) { 
            const s = parseFloat(results.SCORAD); let sevS = s<=24?"Mild":s<=49?"Moderate":s<=74?"Severe":"Very Severe";
            const o = parseFloat(results.oSCORAD); let sevO = o<15?"Mild":o<=40?"Moderate":"Severe";
            return `
                <p><strong>SCORAD: ${results.SCORAD}</strong> (0-103)</p>
                <div class="interpretation-guide">
                    <p>Severity (SCORAD): ${sevS} (0-24 Mild, 25-49 Mod, 50-74 Sev, 75-103 V.Sev)</p><hr>
                    <p><strong>oSCORAD: ${results.oSCORAD}</strong> (0-83)</p>
                    <p>Severity (oSCORAD): ${sevO} (<15 Mild, 15-40 Mod, >40 Sev)</p>
                </div>`;
        },
        references: "European Task Force on Atopic Dermatitis. Dermatology. 1993."
    },
    {
        id: "easi",
        name: "Eczema Area and Severity Index (EASI)",
        shortName: "EASI",
        condition: ["Atopic Dermatitis"],
        purpose: "Measures extent (area) and severity of AD.",
        sourceType: "clinician",
        components: [ 
            { id: "age_group", name: "Age Group", inputType: "select", options: [ {value: "adult", text: ">7 years"}, {value: "child", text: "0-7 years"} ], defaultValue: "adult"},
            ...['Head/Neck', 'Trunk', 'Upper Limbs', 'Lower Limbs'].map(regionName => {
                const mults = { 'Head/Neck': {adult: 0.1, child: 0.2}, 'Trunk': {adult: 0.3, child: 0.3}, 'Upper Limbs': {adult: 0.2, child: 0.2}, 'Lower Limbs': {adult: 0.4, child: 0.3} };
                const id = regionName.toLowerCase().replace(/[\s/]+/g, '_');
                return { id: `region_${id}`, name: `Region: ${regionName}`, inputType: "group", isGridItem: true, tooltip: `Mult: Adult=${mults[regionName].adult}, Child=${mults[regionName].child}`,
                    subComponents: [
                        { id: `${id}_area`, name: "Area(A)", inputType: "select", options: [ {value:0, text:"0(0%)"}, {value:1, text:"1(1-9%)"}, {value:2, text:"2(10-29%)"}, {value:3, text:"3(30-49%)"}, {value:4, text:"4(50-69%)"}, {value:5, text:"5(70-89%)"}, {value:6, text:"6(90+%)"} ], defaultValue: 0 },
                        { id: `${id}_erythema`, name: "Erythema", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"} ], defaultValue: 0 },
                        { id: `${id}_induration`, name: "Induration/Pap.", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"} ], defaultValue: 0 },
                        { id: `${id}_excoriation`, name: "Excoriation", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"} ], defaultValue: 0 },
                        { id: `${id}_lichenification`, name: "Lichenification", inputType: "select", options: [ {value:0, text:"0-None"}, {value:1, text:"1-Mild"}, {value:2, text:"2-Moderate"}, {value:3, text:"3-Severe"} ], defaultValue: 0 },
                    ]
                };
            })
        ],
        calculate: function(inputs) { 
            const age = inputs.age_group; const mults = { head_neck: age==="child"?0.2:0.1, trunk: 0.3, upper_limbs: 0.2, lower_limbs: age==="child"?0.3:0.4 };
            let total=0; const regions=['head_neck', 'trunk', 'upper_limbs', 'lower_limbs']; let scores={};
            regions.forEach(id => { const S=(parseInt(inputs[`${id}_erythema`])||0)+(parseInt(inputs[`${id}_induration`])||0)+(parseInt(inputs[`${id}_excoriation`])||0)+(parseInt(inputs[`${id}_lichenification`])||0); const A=parseInt(inputs[`${id}_area`])||0; const score=S*A*mults[id]; total+=score; const name=this.components.find(c=>c.id===`region_${id}`).name.split('(')[0].replace('Region: ','').trim(); scores[name]={sev:S, area:A, score:score.toFixed(2)}; });
            return { EASI: total.toFixed(2), regionalScores: scores };
        },
        interpret: function(results) { 
            const s=parseFloat(results.EASI); let sev=s<=7?"Mild":s<=21?"Moderate":s<=48?"Severe":"Very Severe"; let details="<h4>Regional:</h4><ul>"; for(const n in results.regionalScores){details+=`<li>${n}: ${results.regionalScores[n].score} (S:${results.regionalScores[n].sev}, A:${results.regionalScores[n].area})</li>`;} details+="</ul>";
            return `<p><strong>EASI: ${results.EASI}</strong> (0-72)</p>${details}<div class="interpretation-guide"><p>Severity: ${sev} (0-7 Mild, 8-21 Mod, 22-48 Sev, 49-72 V.Sev)</p></div>`;
        },
        references: "Hanifin JM, et al. Exp Dermatol. 2001."
    },
    {
        id: "sassad", 
        name: "Six Area, Six Sign AD Severity Score (SASSAD)", shortName: "SASSAD", condition: ["Atopic Dermatitis"],
        purpose: "Records and monitors AD activity.", sourceType: "clinician",
         components: [ 
            { id: "grid", name: "SASSAD Grid", inputType: "grid", description: "Grade signs (0-3) per site.",
                gridStructure: { rows: ["Erythema", "Exudation", "Excoriation", "Dryness", "Cracking", "Lichenification"].map(n=>({id:n.toLowerCase(), name:n})), cols: ["Arms", "Hands", "Legs", "Feet", "Head/Neck", "Trunk"].map(n=>({id:n.toLowerCase().replace('/','_'), name:n})), cellInputType: "select", cellOptions: [{value:0, text:"0"},{value:1, text:"1"},{value:2, text:"2"},{value:3, text:"3"}], cellDefaultValue: 0 },
                 implementationNotes: "Lack of anchors for grades 1-3." }
        ],
        calculate: function(inputs) { 
            let total=0; let siteScores={}; const sites=this.components[0].gridStructure.cols.map(c=>c.id); const signs=this.components[0].gridStructure.rows.map(r=>r.id);
            sites.forEach(siteId=>{ let score=0; signs.forEach(signId=>score+=parseInt(inputs[`${signId}_${siteId}`])||0); const name=this.components[0].gridStructure.cols.find(c=>c.id===siteId).name; siteScores[name]=score; total+=score; });
            return { SASSAD: total, siteScores };
        },
        interpret: function(results) { 
            let details="<h4>Site Scores:</h4><ul>"; for(const n in results.siteScores){details+=`<li>${n}: ${results.siteScores[n]}</li>`;} details+="</ul>";
            return `<p><strong>SASSAD: ${results.SASSAD}</strong> (0-108)</p>${details}<div class="interpretation-guide"><p>Higher=more severe. No standard bands.</p></div>`;
        },
        references: "Berth-Jones J, et al. Br J Dermatol. 1996."
    },
    {
        id: "viga_ad", 
        name: "Validated IGA for AD (vIGA-AD™)", shortName: "vIGA-AD", condition: ["Atopic Dermatitis"],
        purpose: "Static clinician assessment of AD severity.", sourceType: "classification",
        components: [ 
            { id: "grade", name: "Select vIGA-AD™ Grade", inputType: "select", 
              options: [ 
                { value: 0, text: "0 - Clear: No inflammatory signs..." }, { value: 1, text: "1 - Almost Clear: Barely perceptible..." }, 
                { value: 2, text: "2 - Mild: Mild erythema/induration..." }, { value: 3, text: "3 - Moderate: Moderate erythema/induration..." }, 
                { value: 4, text: "4 - Severe: Marked erythema/induration/lichenification..." } 
              ], defaultValue: 0 
            }
        ],
        calculate: function(inputs) { return { grade: parseInt(inputs.grade)||0 }; },
        interpret: function(results) { const map={0:"Clear",1:"Almost",2:"Mild",3:"Moderate",4:"Severe"}; const desc={0:"No inflammatory signs...",1:"Barely perceptible...",2:"Mild erythema/induration...",3:"Moderate erythema/induration...",4:"Marked erythema/induration..."}; return `<p><strong>vIGA-AD™: ${results.grade} (${map[results.grade]})</strong></p><div class="interpretation-guide"><p>Desc: ${desc[results.grade]}</p></div>`; },
        references: "Developed for trials. Eczema Council/FDA."
    },
    {
        id: "hecsi", 
        name: "Hand Eczema Severity Index (HECSI)", shortName: "HECSI", condition: ["Hand Eczema"],
        purpose: "Assesses severity of hand eczema.", sourceType: "clinician",
        components: [ 
            ...["Fingertips", "Fingers(excl)", "Palms", "Backs", "Wrists"].map(area => { const id=area.toLowerCase().slice(0,4); return { id:`area_${id}`, name:`Area: ${area}`, inputType:"group", isGridItem:true, subComponents:[ {id:`${id}_i`, inputType:"static_text", description:"Signs(0-3):"}, ...["Ery","Inf","Ves","Fis","Sca","Oed"].map(sign=>{ const signId=sign.toLowerCase(); return {id:`${id}_${signId}`, name:sign, inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0}; }), {id:`${id}_a`, name:"Area(A, 0-4)", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"},{value:4,text:"4"}], defaultValue:0} ] }; })
        ],
        calculate: function(inputs) { 
            let total=0; const areas=["fing","fing","palm","back","wris"]; const signs=["ery","inf","ves","fis","sca","oed"];
            areas.forEach(id=>{ let intensity=0; signs.forEach(sign=>intensity+=parseInt(inputs[`${id}_${sign}`])||0); const areaVal=parseInt(inputs[`${id}_a`])||0; total+=intensity*areaVal; }); return { HECSI: total };
        },
        interpret: function(results) { const s=results.HECSI; let sev=s===0?"Clear":s<=16?"Almost":s<=37?"Mod":s<=116?"Sev":"V.Sev"; return `<p><strong>HECSI: ${s}</strong> (0-360)</p><div class="interpretation-guide"><p>Severity(Ex): ${sev}</p></div>`; },
        references: "Held E, et al. Br J Dermatol. 2005."
    },
     {
        id: "dasi", 
        name: "Dyshidrotic Eczema Area and Severity Index (DASI)", shortName: "DASI", condition: ["Dyshidrotic Eczema"],
        purpose: "Assesses severity of dyshidrotic eczema.", sourceType: "clinician",
        components: [ 
            { id:"v", name:"Vesicles/cm²(0-3)", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0 }, { id:"e", name:"Erythema(0-3)", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0 }, { id:"d", name:"Desq.(0-3)", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0 }, { id:"i", name:"Itching(0-3)", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0 }, { id:"ext", name:"Extension %(0-100)", inputType:"number", min:0, max:100, defaultValue:0 } 
        ],
         calculate: function(inputs) { const score=(inputs.v*1||0)+(inputs.e*1||0)+(inputs.d*1||0)+(inputs.i*1||0); return { DASI_Partial: score, Ext:inputs.ext||0 }; }, // Simplified
        interpret: function(results) { return `<p><strong>DASI(Partial): ${results.DASI_Partial}</strong></p><div class="interpretation-guide"><p>Higher=more severe. Full formula needed (Max 60). Ex: Mild 0-15, Mod 16-30, Sev 31-60.</p></div>`; },
        references: "Vocks E, et al. Dermatology. 2000."
    },
            
    // ACNE
    {
        id: "iga_acne", 
        name: "IGA for Acne Vulgaris", shortName: "IGA Acne", condition: ["Acne Vulgaris"],
        purpose: "Static clinician assessment of overall facial acne severity.", sourceType: "classification",
        components: [ 
            { id: "grade", name: "Select IGA Grade", inputType: "select", options: [ {value:0,text:"0-Clear"}, {value:1,text:"1-Almost Clear"}, {value:2,text:"2-Mild"}, {value:3,text:"3-Moderate"}, {value:4,text:"4-Severe"} ], defaultValue: 0 },
            { id: "baseline", name: "Baseline IGA", inputType: "select", options: [ {value:-1,text:"N/A"},{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"},{value:4,text:"4"} ], defaultValue: -1}
        ],
         calculate: function(inputs) { const current=parseInt(inputs.grade); const base=parseInt(inputs.baseline); let success="N/A"; if(base!==-1) success=(current<=1 && base-current>=2)?"Achieved":"Not Achieved"; return { grade:current, baseline:base, success }; },
         interpret: function(results) { const map={0:"Clear",1:"Almost",2:"Mild",3:"Mod",4:"Sev","-1":"N/A"}; let html=`<p><strong>IGA Acne: ${results.grade} (${map[results.grade]})</strong></p>`; if(results.baseline!==-1) html+=`<div class="interpretation-guide"><p>Tx Success (vs Base ${results.baseline}): ${results.success}</p></div>`; return html; },
        references: "FDA guidance / Trial protocols."
    },
    {
        id: "gags", 
        name: "Global Acne Grading System (GAGS)", shortName: "GAGS", condition: ["Acne Vulgaris"],
        purpose: "Global score for acne severity based on lesion type/location.", sourceType: "clinician",
        components: [ 
            ...[{id:"fore",n:"Forehead",f:2},{id:"rchk",n:"R Cheek",f:2},{id:"lchk",n:"L Cheek",f:2},{id:"nose",n:"Nose",f:1},{id:"chin",n:"Chin",f:1},{id:"back",n:"Chest/Back",f:3}].map(loc=>({ id:`gags_${loc.id}`, name:`${loc.n}(x${loc.f})`, inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"},{value:4,text:"4"}], defaultValue:0, isGridItem:true, tooltip:"0=None, 1=Comedones, 2=Papules, 3=Pustules, 4=Nodules" }))
        ],
        calculate: function(inputs) { let score=0; let scores={}; const locs=[{id:"fore",f:2},{id:"rchk",f:2},{id:"lchk",f:2},{id:"nose",f:1},{id:"chin",f:1},{id:"back",f:3}]; locs.forEach(l=>{const g=parseInt(inputs[`gags_${l.id}`])||0; const s=g*l.f; score+=s; const name=this.components.find(c=>c.id===`gags_${l.id}`).name.split('(')[0]; scores[name]=s;}); return { GAGS:score, scores }; },
        interpret: function(results) { const s=results.GAGS; let sev=s===0?"Clear":s<=18?"Mild":s<=30?"Mod":s<=38?"Sev":"V.Sev"; return `<p><strong>GAGS: ${s}</strong> (0-44)</p><div class="interpretation-guide"><p>Severity: ${sev} (1-18 Mild, 19-30 Mod, 31-38 Sev, 39+ V.Sev)</p></div>`; },
        references: "Doshi A, et al. 1997. Adityan B, et al. 2009."
    },
    {
        id: "acneqol", 
        name: "Acne-Specific Quality of Life (Acne-QoL)", shortName: "Acne-QoL", condition: ["Acne Vulgaris", "Quality of Life"],
        purpose: "Measures impact of facial acne on QoL.", sourceType: "patient",
        components: [ { id: "total", name: "Total Score", inputType: "number", defaultValue:0, description:"Input score (Range/Interpretation depends on version)." } ],
        calculate: function(inputs) { return { Score: inputs.total||0 }; },
        interpret: function(results) { return `<p><strong>Acne-QoL: ${results.Score}</strong></p><div class="interpretation-guide"><p>Original: LOWER=better. Standardized(0-100): HIGHER=worse.</p></div>`; },
        references: "Martin AR, et al. 1998. Fehnel SE, et al. 2002."
    },

    // URTICARIA / ANGIOEDEMA
     {
        id: "uas7", 
        name: "Urticaria Activity Score over 7 days (UAS7)", shortName: "UAS7", condition: ["Urticaria"],
        purpose: "Patient-reported CSU activity over 7 days.", sourceType: "patient",
        components: [ {id:"l",name:"Daily Scores(7 Days)",inputType:"static_text"}, ...Array.from({length:7},(_,i)=>({ id:`d${i+1}`, name:`Day ${i+1}`, inputType:"daily_input_group", subComponents:[ {id:`w${i+1}`, name:"Wheals", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0, tooltip:"0=0, 1=<20, 2=20-50, 3=>50"}, {id:`i${i+1}`, name:"Itch", inputType:"select", options:[{value:0,text:"0"},{value:1,text:"1"},{value:2,text:"2"},{value:3,text:"3"}], defaultValue:0, tooltip:"0=None, 1=Mild, 2=Mod, 3=Intense"} ]})) ],
        calculate: function(inputs) { let total=0; for(let d=1;d<=7;d++){total+=(parseInt(inputs[`w${d}`])||0)+(parseInt(inputs[`i${d}`])||0);} return { UAS7: total }; },
        interpret: function(results) { const s=results.UAS7; let l=s===0?"Free":s<=6?"Well":s<=15?"Mild":s<=27?"Mod":"Severe"; return `<p><strong>UAS7: ${s}</strong> (0-42)</p><div class="interpretation-guide"><p>Activity: ${l} (0 Free, 1-6 Well, 7-15 Mild, 16-27 Mod, 28-42 Sev)</p></div>`; },
        references: "Zuberbier T, et al. 2009. Mathias SD, et al. 2012."
    },
     {
        id: "uct", 
        name: "Urticaria Control Test (UCT)", shortName: "UCT", condition: ["Urticaria"],
        purpose: "Patient-reported control over last 4 weeks.", sourceType: "patient",
        components: [ {id:"q1",name:"1.Symptoms?",options:[{v:4,t:"Very mild"},{v:3,t:"Mild"},{v:2,t:"Mod"},{v:1,t:"Sev"},{v:0,t:"V.Sev"}]}, {id:"q2",name:"2.QoL Impact?",options:[{v:4,t:"None"},{v:3,t:"Slight"},{v:2,t:"Mod"},{v:1,t:"Strong"},{v:0,t:"V.Strong"}]}, {id:"q3",name:"3.Tx insufficient?",options:[{v:4,t:"None"},{v:3,t:"Slight"},{v:2,t:"Mod"},{v:1,t:"Strong"},{v:0,t:"V.Strong"}]}, {id:"q4",name:"4.Overall control?",options:[{v:4,t:"Complete"},{v:3,t:"Well"},{v:2,t:"Mod"},{v:1,t:"Poor"},{v:0,t:"Uncontrol"}]} ].map(q=>({id:q.id, name:q.name, inputType:"select", options:q.options.map(o=>({value:o.v, text:o.t})), defaultValue:4})),
        calculate: function(inputs) { return { UCT: (inputs.q1*1||0)+(inputs.q2*1||0)+(inputs.q3*1||0)+(inputs.q4*1||0) }; },
        interpret: function(results) { return `<p><strong>UCT: ${results.UCT}</strong> (0-16)</p><div class="interpretation-guide"><p>Control: ${results.UCT>=12?"Well":"Poorly"} (<12 Poorly, ≥12 Well)</p></div>`; },
        references: "Weller K, et al. J Allergy Clin Immunol. 2014."
    },
    {
        id: "aas", 
        name: "Angioedema Activity Score (AAS)", shortName: "AAS", condition: ["Angioedema"],
        purpose: "Patient diary for recurrent angioedema activity.", sourceType: "patient",
        components: [ {id:"i",inputType:"static_text",description:"Score 5 items(0-3) for a representative day."}, {id:"p",name:"1.#Parts?",options:[{v:0,t:"0"},{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"≥3"}]}, {id:"d",name:"2.Duration?",options:[{v:0,t:"<1h"},{v:1,t:"1-6h"},{v:2,t:"6-24h"},{v:3,t:">24h"}]}, {id:"s",name:"3.Severity?",options:[{v:0,t:"0"},{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"3"}]}, {id:"f",name:"4.Function?",options:[{v:0,t:"0"},{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"3"}]}, {id:"a",name:"5.Appearance?",options:[{v:0,t:"0"},{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"3"}]} ].map(q=>({id:"aas_"+q.id, name:q.name, inputType:q.inputType||"select", options:(q.options||[]).map(o=>({value:o.v, text:o.t})), defaultValue:0, description:q.description})),
        calculate: function(inputs) { const score = (parseInt(inputs.aas_p)||0)+(parseInt(inputs.aas_d)||0)+(parseInt(inputs.aas_s)||0)+(parseInt(inputs.aas_f)||0)+(parseInt(inputs.aas_a)||0); return { AAS_Day: score }; },
        interpret: function(results) { return `<p><strong>AAS(Day): ${results.AAS_Day}</strong> (Max 15/day)</p><div class="interpretation-guide"><p>Higher=more activity. Total over period (AAS7/28) tracks cumulative activity.</p></div>`; },
        references: "Weller K, et al. Allergy. 2012."
    },

    // MELASMA / VITILIGO
     {
        id: "masi_mmasi", 
        name: "Melasma Area & Severity Index (MASI/mMASI)", shortName: "MASI/mMASI", condition: ["Melasma"],
        purpose: "Assesses melasma severity.", sourceType: "clinician",
        components: [ 
            { id:"type", name:"Type", inputType:"select", options:[{value:"masi",text:"MASI"},{value:"mmasi",text:"mMASI"}], defaultValue:"masi", isConditionalTrigger:true },
            ...[{id:"f",n:"Forehead",m:0.3},{id:"rm",n:"R Malar",m:0.3},{id:"lm",n:"L Malar",m:0.3},{id:"c",n:"Chin",m:0.1}].map(r=>({ id:`r_${r.id}`, name:`${r.n}(x${r.m})`, inputType:"group", isGridItem:true, subComponents:[ {id:`A_${r.id}`,name:"Area(0-6)",inputType:"select",options:Array.from({length:7},(_,i)=>({value:i,text:i})),defaultValue:0}, {id:`D_${r.id}`,name:"Darkness(0-4)",inputType:"select",options:Array.from({length:5},(_,i)=>({value:i,text:i})),defaultValue:0}, {id:`H_${r.id}`,name:"Homog(0-4)",inputType:"select",options:Array.from({length:5},(_,i)=>({value:i,text:i})),defaultValue:0, conditionalClassTarget:true} ] }))
        ],
         calculate: function(inputs) { 
            const type=inputs.type; let total=0; const regions=[{id:"f",m:0.3},{id:"rm",m:0.3},{id:"lm",m:0.3},{id:"c",m:0.1}];
            regions.forEach(r=>{ const A=parseInt(inputs[`A_${r.id}`])||0; const D=parseInt(inputs[`D_${r.id}`])||0; const H=(type==="masi")?(parseInt(inputs[`H_${r.id}`])||0):0; total+=(type==="masi")?((D+H)*A*r.m):(D*A*r.m); }); return { score:total.toFixed(2), type:type.toUpperCase() };
        },
        interpret: function(results) { 
            const s=parseFloat(results.score); let sev="N/A"; let range=""; let bands=""; if(results.type==="MASI"){range="0-48"; if(s<16)sev="Mild";else if(s<=32)sev="Mod";else sev="Sev"; bands=`<li>Mild<16</li><li>Mod 16-32</li><li>Sev >32</li>`;} else {range="0-24"; sev="Bands N/A";}
            return `<p><strong>${results.type}: ${s}</strong> (${range})</p><div class="interpretation-guide"><p>Severity: ${sev}</p><ul>${bands}</ul></div>`;
        },
        references: "MASI: Kimbrough-Green CK, et al. 1994. mMASI: Pandya AG, et al. 2011."
    },
    {
        id: "melasqol", 
        name: "Melasma Quality of Life Scale (MELASQOL)", shortName: "MELASQOL", condition: ["Melasma", "Quality of Life"],
        purpose: "Assesses impact of melasma on QoL.", sourceType: "patient",
        components: [ { id:"total", name:"Total Score", inputType:"number", min:10, max:70, defaultValue:10 } ],
        calculate: function(inputs) { return { Score: inputs.total||10 }; },
        interpret: function(results) { return `<p><strong>MELASQOL: ${results.Score}</strong> (10-70)</p><div class="interpretation-guide"><p>Higher=worse QoL.</p></div>`; },
        references: "Balkrishnan R, et al. Br J Dermatol. 2003."
    },
    {
        id: "vasi", 
        name: "Vitiligo Area Scoring Index (VASI)", shortName: "VASI", condition: ["Vitiligo"],
        purpose: "Quantifies vitiligo extent and repigmentation.", sourceType: "clinician",
        components: [ {id:"i",inputType:"static_text",description:"Assess HU & % Depig per region."}, ...["Hands","Upper Ext","Trunk","Lower Ext","Feet","Face/Neck"].map(n=>{const id=n.toLowerCase().slice(0,4).replace('/',''); return {id:`r_${id}`, name:n, inputType:"group", isGridItem:true, subComponents:[{id:`hu_${id}`, name:"HU", inputType:"number",min:0,defaultValue:0},{id:`dep_${id}`,name:"Depig%",inputType:"select",options:[{v:1,t:"100%"},{v:0.9,t:"90%"},{v:0.75,t:"75%"},{v:0.5,t:"50%"},{v:0.25,t:"25%"},{v:0.1,t:"10%"},{v:0,t:"0%"}].map(o=>({value:o.v,text:o.t})),defaultValue:1}]};}) ],
        calculate: function(inputs) { let total=0, facial=0; const regions=["hand","uppe","trun","lowe","feet","face"]; regions.forEach(id=>{const hu=parseFloat(inputs[`hu_${id}`])||0; const mult=parseFloat(inputs[`dep_${id}`]); if(!isNaN(mult)){const score=hu*mult; total+=score; if(id==="face")facial=score;}}); return { T_VASI: Math.min(total,100).toFixed(2), F_VASI: Math.min(facial,100).toFixed(2) }; },
        interpret: function(results) { return `<p><strong>T-VASI: ${results.T_VASI}</strong> (0-100)</p><p><strong>F-VASI: ${results.F_VASI}</strong></p><div class="interpretation-guide"><p>Higher=more depigmentation. Tracks change (VASI50). No baseline severity bands.</p></div>`; },
        references: "Hamzavi I, et al. Arch Dermatol. 2004."
    },
    {
        id: "vida", 
        name: "Vitiligo Disease Activity (VIDA) Score", shortName: "VIDA", condition: ["Vitiligo"],
        purpose: "Assesses current vitiligo activity (patient perception).", sourceType: "patient",
        components: [ { id:"status", name:"Activity Status", inputType:"select", options:[{v:4,t:"+4(≤6wk)"},{v:3,t:"+3(6wk-3mo)"},{v:2,t:"+2(3-6mo)"},{v:1,t:"+1(6-12mo)"},{v:0,t:"0(Stable≥1yr)"},{v:-1,t:"-1(Stable+Repig≥1yr)"}].map(o=>({value:o.v, text:o.t})), defaultValue:0} ],
        calculate: function(inputs) { return { score:parseInt(inputs.status) }; },
        interpret: function(results) { let interp=results.score>0?"Active":results.score===0?"Stable":"Stable+Repig."; return `<p><strong>VIDA: ${results.score>=0?'+':''}${results.score}</strong></p><div class="interpretation-guide"><p>${interp}</p></div>`; },
        references: "Njoo MD, et al. J Eur Acad Dermatol Venereol. 2007."
    },
    {
        id: "vitiqol", 
        name: "Vitiligo-specific Quality of Life (VitiQoL)", shortName: "VitiQoL", condition: ["Vitiligo", "Quality of Life"],
        purpose: "Measures QoL impact of vitiligo.", sourceType: "patient",
        components: [ {id:"total", name:"Total Score", inputType:"number",defaultValue:0, description:"Input score (Range varies)." } ],
        calculate: function(inputs) { return { Score: inputs.total||0 }; },
        interpret: function(results) { return `<p><strong>VitiQoL: ${results.Score}</strong></p><div class="interpretation-guide"><p>Higher=worse QoL.</p></div>`; },
        references: "Lilly E, et al. J Am Acad Dermatol. 2013."
    },

    // MELANOMA SCREENING
    {
        id: "abcde_melanoma", 
        name: "ABCDE Rule for Melanoma", shortName: "ABCDE", condition: ["Melanoma Screening"],
        purpose: "Mnemonic for screening suspicious lesions.", sourceType: "classification",
        components: [ {id:"a",name:"A-Asymmetry",type:"checkbox"}, {id:"b",name:"B-Border",type:"checkbox"}, {id:"c",name:"C-Color",type:"checkbox"}, {id:"d",name:"D-Diameter",type:"checkbox"}, {id:"e",name:"E-Evolution",type:"checkbox"} ].map(i=>({id:i.id, name:i.name, inputType:i.type})),
        calculate: function(inputs) { const f=[]; if(inputs.a)f.push("A"); if(inputs.b)f.push("B"); if(inputs.c)f.push("C"); if(inputs.d)f.push("D"); if(inputs.e)f.push("E"); return { present:f, warning:f.length>0 }; },
        interpret: function(results) { let msg=results.warning?`<strong>Warning: ${results.present.join(',')} present. Eval needed.</strong>`:"No ABCDE signs."; return `<p>${msg}</p>`; },
        references: "Rigel DS, et al. J Am Acad Dermatol. 1985."
    },
    {
        id: "seven_point_checklist", 
        name: "7-Point Checklist for Melanoma", shortName: "7-Point", condition: ["Melanoma Screening"],
        purpose: "Clinical rule for suspicious lesions needing urgent referral.", sourceType: "clinician",
        components: [ {id:"v",name:"Version",inputType:"select",options:[{value:"o",text:"Original(1pt)"},{value:"w",text:"Weighted(M=2,m=1)"}],defaultValue:"w"}, {id:"maj",inputType:"static_text",description:"<strong>Major</strong>"}, {id:"size",name:"Change size",type:"checkbox"}, {id:"shape",name:"Irreg shape",type:"checkbox"}, {id:"color",name:"Irreg color",type:"checkbox"}, {id:"min",inputType:"static_text",description:"<strong>Minor</strong>"}, {id:"diam",name:"Diam>7mm",type:"checkbox"}, {id:"infl",name:"Inflamm.",type:"checkbox"}, {id:"ooze",name:"Oozing/Crust",type:"checkbox"}, {id:"sens",name:"Change sens.",type:"checkbox"} ].map(i=>({id:i.id, name:i.name, inputType:i.inputType||i.type, options:i.options, defaultValue:i.defaultValue, description:i.description})),
         calculate: function(inputs) { let s=0; const v=inputs.v; const feats=[{id:"size",t:"major"},{id:"shape",t:"major"},{id:"color",t:"major"},{id:"diam",t:"minor"},{id:"infl",t:"minor"},{id:"ooze",t:"minor"},{id:"sens",t:"minor"}]; let p=[]; feats.forEach(f=>{if(inputs[f.id]){p.push(this.components.find(c=>c.id===f.id).name); s+=(v==="o"?1:(f.t==="major"?2:1));}}); return { score:s, present:p }; },
        interpret: function(results) { let adv=results.score>=3?`<strong>Urgent Referral (Score ≥3).</strong>`:`Score <3.`; if(inputs.v==='w'&&results.score>=3)adv+=`(Weighted opt.≥4)`; let feats=results.present.length>0?`<li>Present: ${results.present.join(',')}</li>`:''; return `<p><strong>7-Point: ${results.score}</strong></p><ul>${feats}</ul><div class="interpretation-guide"><p>${adv}</p></div>`; },
        references: "MacKie RM. 1983. NICE. Walter FM, et al. 2013."
    },

    // HS
    {
        id: "hurley_staging_hs", 
        name: "Hurley Staging System for HS", shortName: "Hurley HS", condition: ["Hidradenitis Suppurativa"],
        purpose: "Simple clinical staging for HS severity.", sourceType: "classification",
        components: [ { id:"stage", name:"Select Stage", inputType:"select", options:[{value:1, text:"1: Isolated abscesses"},{value:2, text:"2: Recurrent, tracts/scarring"},{value:3, text:"3: Diffuse/interconnected"}], defaultValue:1 } ],
        calculate: function(inputs) { return { stage: parseInt(inputs.stage)||1 }; },
        interpret: function(results) { const map={1:"Mild",2:"Moderate",3:"Severe"}; const desc={1:"Isolated...",2:"Recurrent...",3:"Diffuse..."}; return `<p><strong>Hurley Stage: ${results.stage} (${map[results.stage]})</strong></p><div class="interpretation-guide"><p>${desc[results.stage]}</p></div>`; },
        references: "Hurley HJ. 1989."
    },
    { 
        id: "mss_hs", 
        name: "Modified Sartorius Score (mSS) for HS", shortName: "mSS HS", condition: ["Hidradenitis Suppurativa"],
        purpose: "Dynamic score for HS severity.", sourceType: "clinician",
         components: [ 
             {id:"r_lbl",inputType:"static_text",name:"Regions(3pt/ea)"}, ...["Ax(L)","Ax(R)","Gr(L)","Gr(R)","Gen(L)","Gen(R)","Gl(L)","Gl(R)","IM(L)","IM(R)","Other"].map(n=>({id:`r_${n.slice(0,3).toLowerCase()}`,name:n,inputType:"checkbox"})),
             {id:"l_lbl",inputType:"static_text",name:"Aggregated Items"}, {id:"nod",name:"IN(x2)",inputType:"number",min:0,defaultValue:0}, {id:"fis",name:"Fistulas(x4)",inputType:"number",min:0,defaultValue:0}, {id:"sca",name:"Scars(x1)",inputType:"number",min:0,defaultValue:0}, {id:"oth",name:"Other(x1)",inputType:"number",min:0,defaultValue:0},
             {id:"dist",name:"Longest Dist",inputType:"select",options:[{v:2,t:"<5cm"},{v:4,t:"5-<10cm"},{v:8,t:"≥10cm"}].map(o=>({value:o.v,text:o.t})),defaultValue:2}, {id:"sep",name:"Confluence?",inputType:"select",options:[{value:0,text:"No(0pt)"},{value:6,text:"Yes(6pt)"}].map(o=>({value:o.v,text:o.t})),defaultValue:0}
         ].map(c=>({...c, id:`mss_${c.id}`})), // Prefix all IDs
        calculate: function(inputs) { let s=0, r=0; this.components.filter(c=>c.id.startsWith("mss_r_")).forEach(c=>{if(inputs[c.id])r++;}); s+=r*3+(inputs.mss_nod*2||0)+(inputs.mss_fis*4||0)+(inputs.mss_sca*1||0)+(inputs.mss_oth*1||0)+(parseInt(inputs.mss_dist)||0)+(parseInt(inputs.mss_sep)||0); return { mSS: s, regions:r }; },
        interpret: function(results) { return `<p><strong>mSS(Simplified): ${results.mSS}</strong></p><div class="interpretation-guide"><p>Higher=more severe. Tracks change.</p></div>`; },
        references: "Sartorius K, et al. Br J Dermatol. 2009."
    },
    {
        id: "hspga", 
        name: "HS-PGA", shortName: "HS-PGA", condition: ["Hidradenitis Suppurativa"],
        purpose: "Static, 6-point global HS severity.", sourceType: "classification",
        components: [ {id:"in",name:"IN",type:"number"},{id:"a",name:"A",type:"number"},{id:"df",name:"DF",type:"number"},{id:"nin",name:"NIN",type:"number",tooltip:"For Gr 1 vs 0"} ].map(i=>({id:`hspga_${i.id}`,name:i.name,inputType:i.type,min:0,defaultValue:0,tooltip:i.tooltip})),
         calculate: function(inputs) { const IN=parseInt(inputs.hspga_in)||0, A=parseInt(inputs.hspga_a)||0, DF=parseInt(inputs.hspga_df)||0, NIN=parseInt(inputs.hspga_nin)||0; let s=-1; if(A>=6||DF>=6||(A+DF)>=6)s=5; else if(((A>=2&&A<=5)||(DF>=2&&DF<=5))&&IN>=10)s=4; else if((A===0&&DF===0&&IN>=5)||((A===1||DF===1)&&IN>=1)||(((A>=2&&A<=5)||(DF>=2&&DF<=5))&&IN<10))s=3; else if((A===0&&DF===0&&(IN>=1&&IN<=4))||((A===1||DF===1)&&IN===0))s=2; else if(A===0&&DF===0&&IN===0&&NIN>=0)s=1; if(A===0&&DF===0&&IN===0&&NIN===0)s=0; return { HS_PGA: s }; },
        interpret: function(results) { const m={0:"Clear",1:"Min",2:"Mild",3:"Mod",4:"Sev",5:"V.Sev","-1":"?"}; return `<p><strong>HS-PGA: ${results.HS_PGA} (${m[results.HS_PGA]})</strong></p>`; },
        references: "Developed for trials."
    },
    {
        id: "hiscr", 
        name: "HiSCR", shortName: "HiSCR", condition: ["Hidradenitis Suppurativa"],
        purpose: "Defines treatment response in HS trials.", sourceType: "system",
         components: [ {id:"bl",name:"Baseline",type:"static_text"},{id:"Ab",name:"A",type:"number"},{id:"INb",name:"IN",type:"number"},{id:"DFb",name:"DF",type:"number"}, {id:"fu",name:"Follow-up",type:"static_text"},{id:"Af",name:"A",type:"number"},{id:"INf",name:"IN",type:"number"},{id:"DFf",name:"DF",type:"number"} ].map(i=>({id:i.id, name:i.name, inputType:i.type||"number", min:0, defaultValue:0})),
         calculate: function(inputs) { const Ab=parseInt(inputs.Ab)||0,INb=parseInt(inputs.INb)||0,DFb=parseInt(inputs.DFb)||0,Af=parseInt(inputs.Af)||0,INf=parseInt(inputs.INf)||0,DFf=parseInt(inputs.DFf)||0; const AINb=Ab+INb, AINf=Af+INf; let red=0; if(AINb>0)red=(AINb-AINf)/AINb; else if(AINf===0)red=1; const c1=red>=0.5, c2=Af<=Ab, c3=DFf<=DFb; return { achieved:(c1&&c2&&c3), red:(red*100).toFixed(1), c1,c2,c3 }; },
         interpret: function(results) { return `<p><strong>HiSCR: ${results.achieved?"Achieved":"Not Achieved"}</strong></p><div class="interpretation-guide"><p>≥50% red A+IN(${results.red}%)?${results.c1?'Y':'N'}. No A incr?${results.c2?'Y':'N'}. No DF incr?${results.c3?'Y':'N'}.</p></div>`; },
        references: "Kimball AB, et al. Br J Dermatol. 2014."
    },
    {
        id: "ihs4", 
        name: "IHS4", shortName: "IHS4", condition: ["Hidradenitis Suppurativa"],
        purpose: "Validated, dynamic score for HS severity.", sourceType: "clinician",
        components: [ {id:"Nn",name:"Nodules(x1)",type:"number"},{id:"Na",name:"Abscesses(x2)",type:"number"},{id:"Ndt",name:"Tunnels(x4)",type:"number"} ].map(i=>({id:i.id, name:i.name, inputType:i.type, min:0, defaultValue:0})),
        calculate: function(inputs) { return { IHS4: (inputs.Nn*1||0) + (inputs.Na*2||0) + (inputs.Ndt*4||0) }; },
        interpret: function(results) { const s=results.IHS4; let sev=s<=3?"Mild":s<=10?"Mod":"Severe"; return `<p><strong>IHS4: ${s}</strong></p><div class="interpretation-guide"><p>Severity: ${sev}</p></div>`; },
        references: "Zouboulis CC, et al. Br J Dermatol. 2017."
    },
            
    // QOL / SYMPTOMS
    {
        id: "dlqi", 
        name: "DLQI", shortName: "DLQI", condition: ["Quality of Life"],
        purpose: "Measures impact of skin disease on QoL (adults 16+).", sourceType: "patient",
        components: [ {id:"q1",n:"1.Symptoms?"},{id:"q2",n:"2.Embarrassment?"},{id:"q3",n:"3.Shopping/Home?"},{id:"q4",n:"4.Clothes?"},{id:"q5",n:"5.Social/Leisure?"},{id:"q6",n:"6.Sport?"},{id:"q7",n:"7.Prevent Work/Study?",t:"cond"},{id:"q7a",n:"7a.Problem Work/Study?",t:"sub"},{id:"q8",n:"8.Partner/Friends?"},{id:"q9",n:"9.Sexual Difficulties?"},{id:"q10",n:"10.Treatment Problem?"} ].map(q=>{ const opts=q.t==="cond"?[{v:3,t:"Yes"},{v:-1,t:"No->7a"},{v:0,t:"Not relevant"}]:q.t==="sub"?[{v:2,t:"A lot"},{v:1,t:"A little"},{v:0,t:"Not at all"}]:[{v:3,t:"V.much"},{v:2,t:"A lot"},{v:1,t:"A little"},{v:0,t:"Not at all/relevant"}]; return {id:q.id, name:q.n, inputType:q.t==="sub"?"conditional_group":"select", options:opts.map(o=>({value:o.v,text:o.t})), defaultValue:q.t==="cond"?-1:0, isConditionalTrigger:q.t==="cond", conditionalTargetId:q.t==="cond"?'q7a':undefined, conditionSourceId:q.t==="sub"?'q7':undefined, conditionValue:q.t==="sub"?-1:undefined, subComponents:q.t==="sub"?[{id:q.id, name:q.n, inputType:"select", options:opts.map(o=>({value:o.v,text:o.t})), defaultValue:0}]:undefined}; }),
        calculate: function(inputs) { let s=0; for(let i=1;i<=10;i++){if(i===7){const q7=parseInt(inputs.q7);s+=(q7===3||q7===0)?q7:(parseInt(inputs.q7a)||0);}else{s+=parseInt(inputs[`q${i}`])||0;}} return { DLQI: s }; },
        interpret: function(results) { const s=results.DLQI; let e=s<=1?"No":s<=5?"Small":s<=10?"Mod":s<=20?"V.Large":"Extreme"; return `<p><strong>DLQI: ${s}</strong> (0-30)</p><div class="interpretation-guide"><p>Effect: ${e}</p></div>`; },
        references: "Finlay AY, Khan GK. Clin Exp Dermatol. 1994."
    },
    {
        id: "cdlqi", 
        name: "CDLQI", shortName: "CDLQI", condition: ["Quality of Life", "Pediatric Dermatology"],
        purpose: "Measures QoL impact in children (4-16).", sourceType: "patient", 
         components: [ ...Array.from({length:10}, (_,i)=>({id:`q${i+1}`,name:`Q${i+1}`,inputType:"select",options:[{v:3,t:"Very much/Yes"},{v:2,t:"A lot"},{v:1,t:"A little"},{v:0,t:"Not at all/No/Relevant"}],defaultValue:0})) ],
         calculate: function(inputs) { let s=0; for(let i=1;i<=10;i++){s+=parseInt(inputs[`q${i}`])||0;} return { CDLQI: s }; }, // Simplified sum
        interpret: function(results) { const s=results.CDLQI; let e=s<=1?"No":s<=6?"Small":s<=12?"Mod":s<=18?"V.Large":"Extreme"; return `<p><strong>CDLQI: ${s}</strong> (0-30)</p><div class="interpretation-guide"><p>Effect(Ex): ${e}</p></div>`; },
        references: "Lewis-Jones MS, Finlay AY. Br J Dermatol. 1995."
    },
    {
        id: "skindex29", 
        name: "Skindex-29", shortName: "Skindex-29", condition: ["Quality of Life"],
        purpose: "Measures QoL (symptoms, emotions, functioning).", sourceType: "patient",
        components: [ {id:"i",type:"static_text",desc:"Input domain scores(0-100)."}, {id:"symp",name:"Symptoms",type:"number"}, {id:"emot",name:"Emotions",type:"number"}, {id:"func",name:"Functioning",type:"number"} ].map(c=>({id:c.id,name:c.name,inputType:c.type||"number",min:0,max:100,defaultValue:0,description:c.desc})),
        calculate: function(inputs) { const s=inputs.symp||0,e=inputs.emot||0,f=inputs.func||0; return { Symp:s.toFixed(1), Emot:e.toFixed(1), Func:f.toFixed(1), Avg:((s+e+f)/3).toFixed(1) }; },
        interpret: function(results) { return `<p><strong>Skindex-29:</strong> Symp=${results.Symp}, Emot=${results.Emot}, Func=${results.Func}, Avg=${results.Avg}</p><div class="interpretation-guide"><p>Higher=worse QoL.</p></div>`; },
        references: "Chren MM, et al. Arch Dermatol. 1997."
    },
     {
        id: "vas_pruritus", 
        name: "VAS for Pruritus", shortName: "VAS Pruritus", condition: ["Pruritus"],
        purpose: "Measures itch intensity.", sourceType: "patient",
        components: [ { id: "vas", name: "VAS Score (0-10 cm)", inputType: "number", min:0, max:10, step:0.1, defaultValue:0 } ],
        calculate: function(inputs) { return { VAS: parseFloat(inputs.vas)||0 }; },
        interpret: function(results) { const s=results.VAS; let sev=s<3?"Mild":s<7?"Mod":s<9?"Sev":"V.Sev"; return `<p><strong>VAS: ${s.toFixed(1)}</strong></p><div class="interpretation-guide"><p>Severity(Ex): ${sev}</p></div>`; },
        references: "Huskisson EC. 1974. Phan NQ, et al. 2012."
    },
    {
        id: "nrs_pruritus", 
        name: "NRS for Pruritus", shortName: "NRS Pruritus", condition: ["Pruritus"],
        purpose: "Quantifies itch intensity (0-10).", sourceType: "patient",
        components: [ { id: "nrs", name: "NRS Score (0-10)", inputType: "number", min:0, max:10, step:1, defaultValue:0 } ],
        calculate: function(inputs) { return { NRS: parseInt(inputs.nrs)||0 }; },
        interpret: function(results) { const s=results.NRS; let sev=s<=3?"Mild":s<=6?"Mod":"Severe"; return `<p><strong>NRS: ${s}</strong></p><div class="interpretation-guide"><p>Severity(Ex): ${sev}</p></div>`; },
        references: "Phan NQ, et al. Acta Derm Venereol. 2012."
    },
     {
        id: "five_d_itch", 
        name: "5-D Itch Scale", shortName: "5-D Itch", condition: ["Pruritus"],
        purpose: "Multidimensional assessment of chronic pruritus.", sourceType: "patient",
         components: [ {id:"d1",n:"Duration"},{id:"d2",n:"Degree"},{id:"d3",n:"Direction"},{id:"d4",n:"Disability"},{id:"d5",n:"Distribution"} ].map(d=>({id:d.id, name:d.n, inputType:"select", options:Array.from({length:5},(_,i)=>({value:i+1,text:i+1})), defaultValue:1})),
         calculate: function(inputs) { let s=0; ['d1','d2','d3','d4','d5'].forEach(id=>s+=parseInt(inputs[id])||0); return { FiveD_Score: s }; },
        interpret: function(results) { return `<p><strong>5-D: ${results.FiveD_Score}</strong> (5-25)</p><div class="interpretation-guide"><p>Higher=more severe/impactful.</p></div>`; },
        references: "Elman S, et al. Br J Dermatol. 2010."
    },

    // ROSACEA
    {
        id: "iga_rosacea", 
        name: "IGA for Rosacea (IGA-R)", shortName: "IGA Rosacea", condition: ["Rosacea"],
        purpose: "Clinician assessment of overall rosacea severity.", sourceType: "classification",
        components: [ { id:"grade", name:"Select IGA Grade", inputType:"select", options:[{v:0,t:"0-Clear"},{v:1,t:"1-Almost"},{v:2,t:"2-Mild"},{v:3,t:"3-Mod"},{v:4,t:"4-Sev"}].map(o=>({value:o.v,text:o.t})), defaultValue:0} ],
        calculate: function(inputs) { return { grade: inputs.grade*1||0 }; },
        interpret: function(results) { const map={0:"Clear",1:"Almost",2:"Mild",3:"Mod",4:"Sev"}; return `<p><strong>IGA Rosacea: ${results.grade} (${map[results.grade]})</strong></p>`; },
        references: "Various versions exist."
    },
    {
        id: "cea_rosacea", 
        name: "Clinical Erythema Assessment (CEA) for Rosacea", shortName: "CEA Rosacea", condition: ["Rosacea"],
        purpose: "Assesses severity of facial erythema.", sourceType: "classification",
        components: [ { id:"grade", name:"Select CEA Grade", inputType:"select", options:[{v:0,t:"0-Clear"},{v:1,t:"1-Almost"},{v:2,t:"2-Mild"},{v:3,t:"3-Mod"},{v:4,t:"4-Sev"}].map(o=>({value:o.v,text:o.t})), defaultValue:0} ],
        calculate: function(inputs) { return { grade: inputs.grade*1||0 }; },
        interpret: function(results) { const map={0:"Clear",1:"Almost",2:"Mild",3:"Mod",4:"Sev"}; return `<p><strong>CEA Rosacea: ${results.grade} (${map[results.grade]})</strong></p>`; },
        references: "Used in trials, e.g., Fowler J Jr, et al. 2013."
    },

    // OTHER / GENERAL
     {
        id: "iss_vis", 
        name: "Ichthyosis Severity Score (ISS/VIS)", shortName: "ISS/VIS", condition: ["Ichthyosis"],
        purpose: "Assesses overall ichthyosis severity.", sourceType: "clinician",
        components: [ {id:"score", name:"Score", inputType:"number", defaultValue:0, description:"Enter pre-calculated score."} ],
        calculate: function(inputs) { return { Score: inputs.score||0 }; },
        interpret: function(results) { return `<p><strong>ISS/VIS: ${results.Score}</strong></p><div class="interpretation-guide"><p>Higher=more severe.</p></div>`; },
        references: "Gånemo A, et al. 2003. Yale instrument 2020."
    },
    {
        id: "loscat", 
        name: "LoSCAT", shortName: "LoSCAT", condition: ["Localized Scleroderma (Morphea)"],
        purpose: "Assesses activity/damage in morphea.", sourceType: "clinician",
        components: [ {id:"pga_a",name:"PGA Act(0-100)",type:"number"},{id:"pga_d",name:"PGA Dam(0-100)",type:"number"},{id:"mrss",name:"mRSS Aff. Sum",type:"number"},{id:"act",name:"LoSCAT Act",type:"number"},{id:"dam",name:"LoSCAT Dam",type:"number"} ].map(c=>({id:`loscat_${c.id}`, name:c.name, inputType:c.type, min:0, max:c.id.startsWith("pga")?100:undefined, defaultValue:0})),
        calculate: function(inputs) { return { PGA_Act:inputs.loscat_pga_a||0, PGA_Dam:inputs.loscat_pga_d||0, mRSS:inputs.loscat_mrss||0, LoSCAT_Act:inputs.loscat_act||0, LoSCAT_Dam:inputs.loscat_dam||0 }; },
        interpret: function(results) { return `<p><strong>LoSCAT:</strong> PGA-Act=${results.PGA_Act}, PGA-Dam=${results.PGA_Dam}, mRSS=${results.mRSS}, Act=${results.LoSCAT_Act}, Dam=${results.LoSCAT_Dam}</p>`; },
        references: "Kelsey CE, Torok KS. 2013. Arkachaisri T, et al. 2009."
    },
     {
        id: "mswat", 
        name: "mSWAT", shortName: "mSWAT", condition: ["CTCL", "Mycosis Fungoides"],
        purpose: "Assesses skin severity in MF/SS.", sourceType: "clinician",
        components: [ { id:"score", name:"Total mSWAT Score", inputType:"number", min:0, max:400, defaultValue:0, description:"Input pre-calculated score."} ],
        calculate: function(inputs) { return { Score: inputs.score||0 }; },
        interpret: function(results) { return `<p><strong>mSWAT: ${results.Score}</strong> (0-400)</p><div class="interpretation-guide"><p>Higher=more severe.</p></div>`; },
        references: "Olsen E, et al. J Clin Oncol. 2011."
    },
     {
        id: "regiscar_dress", 
        name: "RegiSCAR DRESS Severity Score", shortName: "DRESS Score", condition: ["DRESS Syndrome"],
        purpose: "Assesses severity of DRESS.", sourceType: "clinician",
        components: [ { id:"score", name:"Total DRESS Score", inputType:"number", defaultValue:0, description:"Input pre-calculated score."} ],
        calculate: function(inputs) { return { Score: inputs.score||0 }; },
        interpret: function(results) { return `<p><strong>DRESS Score: ${results.Score}</strong></p><div class="interpretation-guide"><p>Higher=more severe.</p></div>`; },
        references: "Kardaun SH, et al. Br J Dermatol. 2013."
    },
     {
        id: "bwat", 
        name: "Bates-Jensen Wound Assessment Tool (BWAT)", shortName: "BWAT", condition: ["Wound Healing", "Ulcers"],
        purpose: "Assessment/monitoring of wound healing.", sourceType: "clinician",
         components: [ {id:"i",inputType:"static_text",description:"Rate 13 items(1=best, 5=worst)."}, ...["Size","Depth","Edges","Undermining","NecType","NecAmount","ExudType","ExudAmount","SkinColorSurr","PeriphEdema","PeriphIndur","Granulation","Epithel"].map(n=>({id:`bwat_${n.slice(0,3).toLowerCase()}`,name:n,inputType:"select",options:[{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"3"},{v:4,t:"4"},{v:5,t:"5"}].map(o=>({value:o.v,text:o.t})),defaultValue:3,isGridItem:true})) ],
        calculate: function(inputs) { let s=0; this.components.filter(c=>c.id.startsWith('bwat_')&&c.inputType==='select').forEach(c=>s+=parseInt(inputs[c.id])||0); return { BWAT: s }; },
        interpret: function(results) { return `<p><strong>BWAT: ${results.BWAT}</strong> (13-65)</p><div class="interpretation-guide"><p>Higher=worse wound.</p></div>`; },
        references: "Bates-Jensen BM. 1997. Harris C, et al. 2010."
    },
     {
        id: "fitzpatrick_wrinkle", 
        name: "Fitzpatrick Wrinkle Scale", shortName: "Fitz Wrinkle", condition: ["Photoaging"],
        purpose: "Grades wrinkling/elastosis.", sourceType: "classification",
        components: [ {id:"class",name:"Select Class",inputType:"select",options:[{v:"I",t:"I(Fine)"},{v:"II",t:"II(Fine-Mod)"},{v:"III",t:"III(Fine-Deep)"}].map(o=>({value:o.v,text:o.t})),defaultValue:"I"} ],
        calculate: function(inputs) { return { Class: inputs.class }; },
        interpret: function(results) { return `<p><strong>Fitz Wrinkle Class: ${results.Class}</strong></p>`; },
        references: "Fitzpatrick RE, et al. Arch Dermatol. 1996."
    },
     {
        id: "glogau_photoaging", 
        name: "Glogau Photoaging Classification", shortName: "Glogau", condition: ["Photoaging"],
        purpose: "Categorizes photoaging.", sourceType: "classification",
        components: [ {id:"type",name:"Select Type",inputType:"select",options:[{v:"I",t:"I(No wrinkles)"},{v:"II",t:"II(Motion)"},{v:"III",t:"III(Rest)"},{v:"IV",t:"IV(Only)"}].map(o=>({value:o.v,text:o.t})),defaultValue:"I"} ],
        calculate: function(inputs) { return { Type: inputs.type }; },
        interpret: function(results) { return `<p><strong>Glogau Type: ${results.Type}</strong></p>`; },
        references: "Glogau RG. Semin Cutan Med Surg. 1996."
    },
     {
        id: "nailfold_capillaroscopy", 
        name: "Nailfold Capillaroscopy Patterns", shortName: "Nailfold Cap.", condition: ["Systemic Sclerosis"],
        purpose: "Assesses microvascular abnormalities (SSc patterns).", sourceType: "classification",
        components: [ {id:"pattern",name:"Identified Pattern",inputType:"select",options:[{v:"Normal",t:"Normal"},{v:"Non-spec",t:"Non-specific"},{v:"SSc-Early",t:"SSc Early"},{v:"SSc-Active",t:"SSc Active"},{v:"SSc-Late",t:"SSc Late"}].map(o=>({value:o.v,text:o.t})),defaultValue:"Normal"} ],
        calculate: function(inputs) { return { Pattern: inputs.pattern }; },
        interpret: function(results) { return `<p><strong>Nailfold Pattern: ${results.Pattern}</strong></p>`; },
        references: "Cutolo M, et al. 2000."
    },
     {
        id: "nih_gvhd_skin", 
        name: "NIH cGVHD Skin Score", shortName: "NIH Skin GVHD", condition: ["GVHD"],
        purpose: "Standardizes skin cGVHD assessment.", sourceType: "classification",
        components: [ {id:"score",name:"Overall Skin Score",inputType:"select",options:[{v:0,t:"0-None"},{v:1,t:"1-Mild"},{v:2,t:"2-Mod"},{v:3,t:"3-Sev"}].map(o=>({value:o.v,text:o.t})),defaultValue:0} ],
        calculate: function(inputs) { return { Score: parseInt(inputs.score)||0 }; },
        interpret: function(results) { const map={0:"None",1:"Mild",2:"Mod",3:"Sev"}; return `<p><strong>NIH Skin Score: ${results.Score} (${map[results.Score]})</strong></p>`; },
        references: "Filipovich AH, et al. 2005. Jagasia MH, et al. 2015."
    },
     {
        id: "behcet_mucocutaneous", 
        name: "Behçet's Mucocutaneous Index", shortName: "BD Muco Idx", condition: ["Behçet's Disease"],
        purpose: "Assesses mucocutaneous activity in Behçet's.", sourceType: "clinician",
        components: [ {id:"score",name:"Activity Score",inputType:"number",defaultValue:0,description:"Input pre-calculated score."} ],
        calculate: function(inputs) { return { Score: inputs.score||0 }; },
        interpret: function(results) { return `<p><strong>BD Muco Score: ${results.Score}</strong></p>`; },
        references: "Various indices proposed."
    },
     {
        id: "mfg_score", 
        name: "Ferriman-Gallwey Score (mFG)", shortName: "mFG Score", condition: ["Hirsutism"],
        purpose: "Evaluates hirsutism in women.", sourceType: "clinician",
         components: [ {id:"info",inputType:"static_text",description:"Rate 9 areas (0-4)."}, ...["Up lip","Chin","Chest","Up back","Low back","Up abd","Low abd","Arm","Thigh"].map(n=>({id:`fg_${n.slice(0,3).toLowerCase()}`,name:n,inputType:"select",options:[{v:0,t:"0"},{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"3"},{v:4,t:"4"}].map(o=>({value:o.v,text:o.t})),defaultValue:0,isGridItem:true})) ],
        calculate: function(inputs) { let s=0; this.components.filter(c=>c.id.startsWith('fg_')).forEach(c=>s+=parseInt(inputs[c.id])||0); return { mFG: s }; },
        interpret: function(results) { const s=results.mFG; let l=s<8?"Normal":s<=15?"Mild":"Mod/Sev"; return `<p><strong>mFG: ${s}</strong> (0-36)</p><div class="interpretation-guide"><p>${l} (≥8 Hirsutism)</p></div>`; },
        references: "Ferriman D, Gallwey JD. 1961."
    },
     {
        id: "ctcae_skin", 
        name: "CTCAE - Skin Toxicities", shortName: "CTCAE Skin", condition: ["Adverse Drug Reactions"],
        purpose: "Standardized grading of dermatologic AEs.", sourceType: "classification",
        components: [ {id:"ae",name:"AE Term",inputType:"text"}, {id:"grade",name:"Grade(1-5)",inputType:"select",options:[{v:1,t:"1"},{v:2,t:"2"},{v:3,t:"3"},{v:4,t:"4"},{v:5,t:"5"}].map(o=>({value:o.v,text:o.t})),defaultValue:1} ],
        calculate: function(inputs) { return { AE:inputs.ae||"N/A", Grade:parseInt(inputs.grade)||0 }; },
        interpret: function(results) { const m={1:"Mild",2:"Mod",3:"Sev",4:"LifeThr",5:"Death"}; return `<p><strong>CTCAE: ${results.AE} - Grade ${results.Grade} (${m[results.Grade]})</strong></p>`; },
        references: "NCI/NIH CTCAE Manual (current)."
    },
     {
        id: "bilag_skin", 
        name: "BILAG - Skin Component", shortName: "BILAG Skin", condition: ["Lupus"],
        purpose: "Assesses lupus activity (mucocutaneous).", sourceType: "classification",
        components: [ {id:"grade", name:"Mucocutaneous Grade", inputType:"select", options:[{v:"A",t:"A"},{v:"B",t:"B"},{v:"C",t:"C"},{v:"D",t:"D"},{v:"E",t:"E"}].map(o=>({value:o.v,text:o.t})), defaultValue:"E"} ],
        calculate: function(inputs) { return { Grade: inputs.grade }; },
        interpret: function(results) { let i=results.Grade==='A'||results.Grade==='B'?"Active":results.Grade==='C'?"Mild":"Inactive"; return `<p><strong>BILAG Skin: ${results.Grade}</strong> (${i})</p>`; },
        references: "Hay EM, et al. 1993. Isenberg DA, et al. 2005."
    },
     {
        id: "sledai_skin", 
        name: "SLEDAI - Skin Descriptors", shortName: "SLEDAI Skin", condition: ["Lupus"],
        purpose: "Scores skin items for overall SLEDAI.", sourceType: "clinician",
        components: [ {id:"r",name:"Rash(4pt)",type:"checkbox"},{id:"a",name:"Alopecia(4pt)",type:"checkbox"},{id:"m",name:"Mucosal(4pt)",type:"checkbox"},{id:"v",name:"Vasculitis(8pt)",type:"checkbox"} ].map(i=>({id:`sledai_${i.id}`, name:i.name, inputType:i.type})),
        calculate: function(inputs) { let s=0; if(inputs.sledai_r)s+=4; if(inputs.sledai_a)s+=4; if(inputs.sledai_m)s+=4; if(inputs.sledai_v)s+=8; return { Skin_Score: s }; },
        interpret: function(results) { return `<p><strong>SLEDAI Skin Score: ${results.Skin_Score}</strong></p>`; },
        references: "Bombardier C, et al. 1992. Gladman DD, et al. 2002."
    },
    {
        id: "bvas_skin", 
        name: "BVAS - Skin Component", shortName: "BVAS Skin", condition: ["Vasculitis"],
        purpose: "Scores skin items for overall BVAS.", sourceType: "clinician",
        components: [ {id:"r",name:"Rash",type:"select",options:[{v:0,t:"0"},{v:1,t:"1(Persist)"},{v:3,t:"3(New/Worse)"}]}, {id:"u",name:"Ulcer(1pt)",type:"checkbox"}, {id:"g",name:"Gangrene(6pt)",type:"checkbox"}, {id:"o",name:"Other(1pt)",type:"checkbox"} ].map(i=>({id:`bvas_${i.id}`, name:i.name, inputType:i.type||"select", options:i.options?i.options.map(o=>({value:o.v,text:o.t})):undefined, defaultValue:0})),
        calculate: function(inputs) { let s=0; s+=parseInt(inputs.bvas_r)||0; if(inputs.bvas_u)s+=1; if(inputs.bvas_g)s+=6; if(inputs.bvas_o)s+=1; return { Skin_Score: s }; },
        interpret: function(results) { return `<p><strong>BVAS Skin (Approx): ${results.Skin_Score}</strong></p>`; },
        references: "Luqmani RA, et al. 1994. Mukhtyar C, et al. 2009 (BVAS v3)."
    },
    {
        id: "essdai_cutaneous", 
        name: "ESSDAI - Cutaneous Domain", shortName: "ESSDAI Cutaneous", condition: ["Sjögren's Syndrome"],
        purpose: "Scores cutaneous domain of ESSDAI.", sourceType: "clinician",
         components: [ {id:"level",name:"Activity Level",inputType:"select",options:[{v:0,t:"0-None"},{v:1,t:"1-Low"},{v:2,t:"2-Mod"},{v:3,t:"3-High"}].map(o=>({value:o.v,text:o.t})),defaultValue:0} ],
        calculate: function(inputs) { const level=parseInt(inputs.level)||0; return { Level:level, Weighted:level*2 }; }, 
        interpret: function(results) { return `<p><strong>ESSDAI Cutaneous: Level ${results.Level}, Weighted ${results.Weighted}</strong></p>`; },
        references: "Seror R, et al. Ann Rheum Dis. 2010."
    },
    {
        id: "scorten", 
        name: "SCORTEN", shortName: "SCORTEN", condition: ["SJS/TEN"],
        purpose: "Prognostic score for SJS/TEN mortality.", sourceType: "clinician",
        components: [ {id:"age",n:"Age≥40"},{id:"mal",n:"Malignancy"},{id:"hr",n:"HR≥120"},{id:"bsa",n:"BSA>10%"},{id:"urea",n:"Urea>10"},{id:"bic",n:"Bicarb<20"},{id:"gluc",n:"Glucose>14"} ].map(i=>({id:`scorten_${i.id}`, name:i.n, inputType:"checkbox"})),
        calculate: function(inputs) { let s=0; ['age','mal','hr','bsa','urea','bic','gluc'].forEach(id=>{if(inputs[`scorten_${id}`])s++;}); return { SCORTEN: s }; },
        interpret: function(results) { const s=results.SCORTEN; const mort={"0":"3%","1":"12%","2":"35%","3":"58%","4":"58%+","5":">90%"}; return `<p><strong>SCORTEN: ${s}</strong> (0-7)</p><div class="interpretation-guide"><p>Mortality(approx): ${mort[s]||">90%"}</p></div>`; },
        references: "Bastuji-Garin S, et al. J Invest Dermatol. 2000."
    },
     {
        id: "fitzpatrick_skin_type", 
        name: "Fitzpatrick Skin Type", shortName: "Fitzpatrick", condition: ["Skin Typing"],
        purpose: "Classifies skin based on UV response.", sourceType: "classification",
        components: [ {id:"type",name:"Select Type",inputType:"select",options:[{v:"I",t:"I(Always burns)"},{v:"II",t:"II(Usually burns)"},{v:"III",t:"III(Sometimes burns)"},{v:"IV",t:"IV(Rarely burns)"},{v:"V",t:"V(V.rarely burns)"},{v:"VI",t:"VI(Never burns)"}].map(o=>({value:o.v,text:o.t})),defaultValue:"III"} ],
        calculate: function(inputs) { return { type: inputs.type }; },
        interpret: function(results) { return `<p><strong>Fitzpatrick Type: ${results.type}</strong></p>`; },
        references: "Fitzpatrick TB. Arch Dermatol. 1988."
    }

];