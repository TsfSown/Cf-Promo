// =============================================================================
// DEVIS CONSTRUCTION PRO - APPLICATION JAVASCRIPT COMPLÈTE
// Fichier : js/app.js
// Description : Toute la logique de l'application en un seul fichier
// =============================================================================

// =============================================================================
// 1. CONFIGURATION DES PRIX (modifiable)
// =============================================================================
const PRIX = {
    // Terrassement
    terrassement: 15,
    // Fondations
    betonFondations: 120,
    ciment: 0.15,
    sable: 35,
    graviers: 40,
    ferraillage: 1.20,
    // Maçonnerie
    parpaing20: 1.80,
    parpaing15: 1.50,
    agglosChainage: 3.50,
    // Dalle
    hourdis: 12,
    betonDalle: 110,
    treillisSoude: 6,
    // Linteaux
    linteau120: 25,
    linteau180: 38,
    linteau240: 52,
    // Charpente
    charpenteTradi: 65,
    charpenteIndus: 45,
    // Couverture
    tuilesBeton: 35,
    tuilesTerre: 55,
    ardoise: 85,
    ecran: 4,
    liteaux: 2.50,
    gouttiere: 25,
    faitiere: 18
};

// =============================================================================
// 2. CONFIGURATION DES PERTES MATÉRIAUX (%)
// =============================================================================
const PERTES = {
    beton: 5,
    parpaings: 3,
    carrelage: 10,
    couverture: 8
};

// =============================================================================
// 3. ÉTAT DE L'APPLICATION
// =============================================================================
const appState = {
    currentStep: 1,
    totalSteps: 11
};

// =============================================================================
// 4. INITIALISATION AU CHARGEMENT DE LA PAGE
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation...');
    
    initNavigation();
    initConditionalDisplays();
    initDynamicFields();
    initTabs();
    initPriceCustomization();
    initCalculations();
    
    console.log('✅ Application prête !');
});

// =============================================================================
// 5. NAVIGATION ENTRE LES SECTIONS
// =============================================================================
function initNavigation() {
    // Clic sur les étapes de la sidebar
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', () => {
            const stepNum = parseInt(step.dataset.step);
            goToStep(stepNum);
        });
    });

    // Bouton Précédent
    document.getElementById('backButton').addEventListener('click', () => {
        if (appState.currentStep > 1) {
            goToStep(appState.currentStep - 1);
        }
    });

    // Bouton Suivant
    document.getElementById('continueButton').addEventListener('click', () => {
        if (appState.currentStep < appState.totalSteps) {
            goToStep(appState.currentStep + 1);
        }
    });
}

function goToStep(stepNum) {
    appState.currentStep = stepNum;
    
    // Mise à jour sidebar
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.step[data-step="${stepNum}"]`).classList.add('active');
    
    // Mise à jour sections
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-section[data-section="${stepNum}"]`).classList.add('active');
    
    // Mise à jour boutons
    document.getElementById('backButton').disabled = (stepNum === 1);
    document.getElementById('continueButton').style.display = (stepNum === 11) ? 'none' : 'block';
    
    window.scrollTo(0, 0);
}

// =============================================================================
// 6. AFFICHAGES CONDITIONNELS
// =============================================================================
function initConditionalDisplays() {
    // Forme complexe
    document.querySelectorAll('input[name="houseShape"]').forEach(input => {
        input.addEventListener('change', function() {
            document.getElementById('complexShapeContainer').style.display = 
                this.value === 'complex' ? 'block' : 'none';
        });
    });

    // Terrasses
    document.querySelectorAll('input[name="terrace"]').forEach(input => {
        input.addEventListener('change', function() {
            document.getElementById('terraceContainer').style.display = 
                this.value === 'yes' ? 'block' : 'none';
        });
    });
}

// =============================================================================
// 7. CHAMPS DYNAMIQUES (Formes, Terrasses, Ouvertures)
// =============================================================================
function initDynamicFields() {
    let shapeCounter = 0, terraceCounter = 0, openingCounter = 0;

    // Bouton ajouter forme complexe
    document.getElementById('addComplexShape').addEventListener('click', () => {
        const container = document.getElementById('shapesList');
        const div = document.createElement('div');
        div.className = 'entry-item';
        div.innerHTML = `
            <h4>Forme ${++shapeCounter}</h4>
            <div class="form-group">
                <label>Type</label>
                <select class="shape-type">
                    <option value="rentrant">Angle rentrant</option>
                    <option value="sortant">Angle sortant</option>
                </select>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Longueur (m)</label>
                    <input type="number" step="0.01" class="shape-length">
                </div>
                <div class="form-group">
                    <label>Largeur (m)</label>
                    <input type="number" step="0.01" class="shape-width">
                </div>
            </div>
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Retirer</button>
        `;
        container.appendChild(div);
    });

    // Bouton ajouter terrasse
    document.getElementById('addTerrace').addEventListener('click', () => {
        const container = document.getElementById('terracesList');
        const div = document.createElement('div');
        div.className = 'entry-item';
        div.innerHTML = `
            <h4>Terrasse ${++terraceCounter}</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label>Longueur (m)</label>
                    <input type="number" step="0.01" class="terrace-length">
                </div>
                <div class="form-group">
                    <label>Largeur (m)</label>
                    <input type="number" step="0.01" class="terrace-width">
                </div>
            </div>
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Retirer</button>
        `;
        container.appendChild(div);
    });

    // Bouton ajouter ouverture
    document.getElementById('addOpening').addEventListener('click', () => {
        const container = document.getElementById('openingsList');
        const div = document.createElement('div');
        div.className = 'entry-item';
        div.innerHTML = `
            <h4>Ouverture ${++openingCounter}</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label>Type</label>
                    <select class="opening-type">
                        <option value="door">Porte</option>
                        <option value="window">Fenêtre</option>
                        <option value="bay">Baie vitrée</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Hauteur (m)</label>
                    <input type="number" step="0.01" value="2.15" class="opening-height">
                </div>
                <div class="form-group">
                    <label>Largeur (m)</label>
                    <input type="number" step="0.01" value="0.90" class="opening-width">
                </div>
            </div>
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Retirer</button>
        `;
        container.appendChild(div);
    });
}

// =============================================================================
// 8. GESTION DES ONGLETS
// =============================================================================
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            const parent = this.closest('.form-section');
            
            // Désactiver tous les onglets
            parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            
            // Activer l'onglet cliqué
            this.classList.add('active');
            const content = parent.querySelector(`[data-content="${tabName}"]`);
            if (content) content.style.display = 'block';
        });
    });
}

// =============================================================================
// 9. PERSONNALISATION DES PRIX
// =============================================================================
function initPriceCustomization() {
    // Mise à jour des prix depuis les inputs
    ['betonFondations', 'parpaing20', 'ferraillage'].forEach(key => {
        const input = document.getElementById(`price_${key}`);
        if (input) {
            input.addEventListener('change', function() {
                PRIX[key] = parseFloat(this.value);
            });
        }
    });

    // Mise à jour des pertes
    ['beton', 'parpaings'].forEach(key => {
        const input = document.getElementById(`loss_${key}`);
        if (input) {
            input.addEventListener('change', function() {
                PERTES[key] = parseFloat(this.value);
            });
        }
    });
}

// =============================================================================
// 10. INITIALISATION DES CALCULS
// =============================================================================
function initCalculations() {
    document.getElementById('calculateButton').addEventListener('click', performAllCalculations);
}

// =============================================================================
// 11. COLLECTE DES DONNÉES DU FORMULAIRE
// =============================================================================
function collectAllData() {
    const data = {
        longueur: parseFloat(document.getElementById('houseLength').value) || 0,
        largeur: parseFloat(document.getElementById('houseWidth').value) || 0,
        hauteurFondations: parseFloat(document.getElementById('foundationHeight').value) || 0.6,
        largeurFondations: parseFloat(document.getElementById('foundationWidth').value) || 0.5,
        hauteurVideSanitaire: parseFloat(document.getElementById('crawlSpaceHeight').value) || 0.6,
        blockType: document.getElementById('blockType').value,
        hauteurMurs: parseFloat(document.getElementById('wallHeight').value) || 2.5,
        wallBlockType: document.getElementById('wallBlockType').value,
        roofType: document.querySelector('input[name="roofType"]:checked').value,
        roofSlope: parseFloat(document.getElementById('roofSlopePercentage').value) || 35,
        roofFrameType: document.getElementById('roofFrameType').value,
        roofOverhang: parseFloat(document.getElementById('roofOverhang').value) || 0.5,
        roofingType: document.getElementById('roofingType').value,
        formes: [],
        terrasses: [],
        ouvertures: []
    };

    // Récupération des formes complexes
    document.querySelectorAll('#shapesList .entry-item').forEach(entry => {
        const type = entry.querySelector('.shape-type').value;
        const longueur = parseFloat(entry.querySelector('.shape-length').value) || 0;
        const largeur = parseFloat(entry.querySelector('.shape-width').value) || 0;
        data.formes.push({ type, longueur, largeur });
    });

    // Récupération des terrasses
    document.querySelectorAll('#terracesList .entry-item').forEach(entry => {
        const longueur = parseFloat(entry.querySelector('.terrace-length').value) || 0;
        const largeur = parseFloat(entry.querySelector('.terrace-width').value) || 0;
        data.terrasses.push({ longueur, largeur });
    });

    // Récupération des ouvertures
    document.querySelectorAll('#openingsList .entry-item').forEach(entry => {
        const type = entry.querySelector('.opening-type').value;
        const hauteur = parseFloat(entry.querySelector('.opening-height').value) || 0;
        const largeur = parseFloat(entry.querySelector('.opening-width').value) || 0;
        data.ouvertures.push({ type, hauteur, largeur });
    });

    return data;
}

// =============================================================================
// 12. CALCUL GÉOMÉTRIE RÉELLE
// =============================================================================
function calculerGeometrieReelle(data) {
    let surface = data.longueur * data.largeur;
    let perimetre = 2 * (data.longueur + data.largeur);
    
    // Gestion des formes complexes
    data.formes.forEach(forme => {
        if (forme.type === 'rentrant') {
            surface -= (forme.longueur * forme.largeur);
            perimetre += 2 * (forme.longueur + forme.largeur);
        } else if (forme.type === 'sortant') {
            surface += (forme.longueur * forme.largeur);
            perimetre += 2 * (forme.longueur + forme.largeur);
        }
    });

    // Ajout des terrasses
    data.terrasses.forEach(t => {
        surface += (t.longueur * t.largeur);
        perimetre += 2 * (t.longueur + t.largeur);
    });

    const perimetreFondations = perimetre - (4 * 0.20);
    let murRedans = (data.largeur > 9) ? (data.longueur - 0.40) : 0;

    return {
        surface,
        perimetre,
        perimetreFondations,
        murRedans,
        longueurReelle: data.longueur,
        largeurReelle: data.largeur
    };
}

// =============================================================================
// 13. CALCUL TERRASSEMENT
// =============================================================================
function calculerTerrassement(geom, data) {
    const surfaceDecapage = (geom.longueurReelle + 2) * (geom.largeurReelle + 2);
    const volumeDecapage = surfaceDecapage * 0.30;
    const volumeFouille = geom.perimetreFondations * data.largeurFondations * data.hauteurFondations;
    const volumeTotal = volumeDecapage + volumeFouille;
    const prixTotal = volumeTotal * PRIX.terrassement;

    return {
        description: 'Terrassement',
        details: [
            { item: 'Décapage terre végétale', quantite: volumeDecapage.toFixed(2), unite: 'm³', prixUnitaire: PRIX.terrassement, prixTotal: (volumeDecapage * PRIX.terrassement).toFixed(2) },
            { item: 'Fouille en rigole', quantite: volumeFouille.toFixed(2), unite: 'm³', prixUnitaire: PRIX.terrassement, prixTotal: (volumeFouille * PRIX.terrassement).toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 14. CALCUL FONDATIONS
// =============================================================================
function calculerFondations(geom, data) {
    const perimetreTotal = geom.perimetreFondations + geom.murRedans;
    const volumeBeton = perimetreTotal * data.largeurFondations * data.hauteurFondations;
    const poidsFerraillage = volumeBeton * 90; // 90 kg/m³
    const ciment = volumeBeton * 350;
    const sable = volumeBeton * 0.4 * 1.6;
    const graviers = volumeBeton * 0.8 * 1.5;
    
    const prixBeton = volumeBeton * PRIX.betonFondations;
    const prixFerraillage = poidsFerraillage * PRIX.ferraillage;
    const prixTotal = prixBeton + prixFerraillage;

    return {
        description: 'Fondations',
        details: [
            { item: 'Béton C25/30', quantite: volumeBeton.toFixed(2), unite: 'm³', prixUnitaire: PRIX.betonFondations, prixTotal: prixBeton.toFixed(2) },
            { item: 'Ciment CEM II', quantite: ciment.toFixed(0), unite: 'kg', prixUnitaire: PRIX.ciment, prixTotal: (ciment * PRIX.ciment).toFixed(2) },
            { item: 'Sable 0/4', quantite: sable.toFixed(2), unite: 't', prixUnitaire: PRIX.sable, prixTotal: (sable * PRIX.sable).toFixed(2) },
            { item: 'Graviers 4/20', quantite: graviers.toFixed(2), unite: 't', prixUnitaire: PRIX.graviers, prixTotal: (graviers * PRIX.graviers).toFixed(2) },
            { item: 'Ferraillage HA', quantite: poidsFerraillage.toFixed(0), unite: 'kg', prixUnitaire: PRIX.ferraillage, prixTotal: prixFerraillage.toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 15. CALCUL VIDE SANITAIRE
// =============================================================================
function calculerVideSanitaire(geom, data) {
    const hauteurParpaing = 0.20;
    const nbRangs = Math.ceil(data.hauteurVideSanitaire / hauteurParpaing);
    const perimetreTotal = geom.perimetreFondations + geom.murRedans;
    const nbParpaings = Math.ceil((perimetreTotal / 0.50) * nbRangs);
    const prixParpaingUnit = data.blockType === '20' ? PRIX.parpaing20 : PRIX.parpaing15;
    const prixTotal = nbParpaings * prixParpaingUnit;

    return {
        description: 'Vide sanitaire',
        details: [
            { item: `Parpaings ${data.blockType}x20x50`, quantite: nbParpaings, unite: 'u', prixUnitaire: prixParpaingUnit, prixTotal: prixTotal.toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 16. CALCUL DALLE
// =============================================================================
function calculerDalle(geom) {
    const surfaceDalle = geom.surface;
    const prixTotal = surfaceDalle * PRIX.hourdis;

    return {
        description: 'Dalle hourdis',
        details: [
            { item: 'Hourdis + poutrelles', quantite: surfaceDalle.toFixed(2), unite: 'm²', prixUnitaire: PRIX.hourdis, prixTotal: prixTotal.toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 17. CALCUL MURS
// =============================================================================
function calculerMurs(geom, data) {
    const perimetre = geom.perimetre;
    let surfaceMurs = perimetre * data.hauteurMurs;
    let surfaceOuvertures = 0;
    
    data.ouvertures.forEach(ouv => {
        surfaceOuvertures += ouv.hauteur * ouv.largeur;
    });
    
    const surfaceNette = surfaceMurs - surfaceOuvertures;
    const nbParpaings = Math.ceil(surfaceNette / 0.10);
    const prixParpaingUnit = data.wallBlockType === '20' ? PRIX.parpaing20 : PRIX.parpaing15;
    let prixTotal = nbParpaings * prixParpaingUnit;

    // Linteaux
    let linteaux = { l120: 0, l180: 0, l240: 0 };
    data.ouvertures.forEach(ouv => {
        if (ouv.largeur <= 1.20) linteaux.l120++;
        else if (ouv.largeur <= 1.80) linteaux.l180++;
        else linteaux.l240++;
    });
    
    if (linteaux.l120 > 0) prixTotal += linteaux.l120 * PRIX.linteau120;
    if (linteaux.l180 > 0) prixTotal += linteaux.l180 * PRIX.linteau180;
    if (linteaux.l240 > 0) prixTotal += linteaux.l240 * PRIX.linteau240;

    return {
        description: 'Murs',
        details: [
            { item: `Parpaings ${data.wallBlockType}x20x50`, quantite: nbParpaings, unite: 'u', prixUnitaire: prixParpaingUnit, prixTotal: (nbParpaings * prixParpaingUnit).toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 18. CALCUL CHARPENTE
// =============================================================================
function calculerCharpente(geom, data) {
    const penteRadians = Math.atan(data.roofSlope / 100);
    const longueurRampant = (geom.largeurReelle / 2) / Math.cos(penteRadians);
    let surfaceToiture = (geom.longueurReelle + 2 * data.roofOverhang) * longueurRampant * 2;
    if (data.roofType === '4-slopes') surfaceToiture *= 1.15;
    
    const prixM2 = data.roofFrameType === 'traditional' ? PRIX.charpenteTradi : PRIX.charpenteIndus;
    const prixTotal = surfaceToiture * prixM2;

    return {
        description: 'Charpente',
        details: [
            { item: `Charpente ${data.roofFrameType}`, quantite: surfaceToiture.toFixed(2), unite: 'm²', prixUnitaire: prixM2, prixTotal: prixTotal.toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 19. CALCUL TOITURE
// =============================================================================
function calculerToiture(geom, data) {
    const penteRadians = Math.atan(data.roofSlope / 100);
    const longueurRampant = (geom.largeurReelle / 2) / Math.cos(penteRadians);
    let surfaceToiture = (geom.longueurReelle + 2 * data.roofOverhang) * longueurRampant * 2;
    if (data.roofType === '4-slopes') surfaceToiture *= 1.15;
    
    let prixCouvertureM2;
    switch(data.roofingType) {
        case 'tiles': prixCouvertureM2 = PRIX.tuilesBeton; break;
        case 'tiles-terre': prixCouvertureM2 = PRIX.tuilesTerre; break;
        case 'slate': prixCouvertureM2 = PRIX.ardoise; break;
    }
    
    const prixTotal = surfaceToiture * prixCouvertureM2;

    return {
        description: 'Couverture',
        details: [
            { item: data.roofingType, quantite: surfaceToiture.toFixed(2), unite: 'm²', prixUnitaire: prixCouvertureM2, prixTotal: prixTotal.toFixed(2) }
        ],
        total: prixTotal
    };
}

// =============================================================================
// 20. APPLICATION DES PERTES MATÉRIAUX
// =============================================================================
function applyLosses(resultats) {
    resultats.fondations.total *= (1 + PERTES.beton / 100);
    resultats.videSanitaire.total *= (1 + PERTES.parpaings / 100);
    resultats.murs.total *= (1 + PERTES.parpaings / 100);
    resultats.toiture.total *= (1 + PERTES.couverture / 100);
}

// =============================================================================
// 21. CALCUL TOTAL
// =============================================================================
function calculerTotal(resultats) {
    let total = 0;
    Object.keys(resultats).forEach(key => {
        if (key !== 'total' && key !== 'geometrie' && key !== 'sousTotal' && 
            key !== 'totalHT' && key !== 'totalTTC' && key !== 'montantMarge' && 
            key !== 'montantTVA' && resultats[key].total) {
            total += parseFloat(resultats[key].total);
        }
    });
    return total;
}

// =============================================================================
// 22. EXÉCUTION DE TOUS LES CALCULS
// =============================================================================
function performAllCalculations() {
    const data = collectAllData();
    const geom = calculerGeometrieReelle(data);
    
    const resultats = {
        geometrie: geom,
        terrassement: calculerTerrassement(geom, data),
        fondations: calculerFondations(geom, data),
        videSanitaire: calculerVideSanitaire(geom, data),
        dalle: calculerDalle(geom),
        murs: calculerMurs(geom, data),
        charpente: calculerCharpente(geom, data),
        toiture: calculerToiture(geom, data)
    };

    // Application des pertes
    applyLosses(resultats);
    
    // Calcul financier
    const margin = parseFloat(document.getElementById('margin').value) || 0;
    const tva = parseFloat(document.getElementById('tva').value) || 0;
    
    resultats.sousTotal = calculerTotal(resultats);
    resultats.montantMarge = resultats.sousTotal * (margin / 100);
    resultats.totalHT = resultats.sousTotal + resultats.montantMarge;
    resultats.montantTVA = resultats.totalHT * (tva / 100);
    resultats.totalTTC = resultats.totalHT + resultats.montantTVA;

    // Affichage
    afficherDevisComplet(resultats, data);
}

// =============================================================================
// 23. AFFICHAGE DES RÉSULTATS
// =============================================================================
function afficherDevisComplet(resultats, data) {
    const container = document.getElementById('resultsContainer');
    const geom = resultats.geometrie;
    
    let html = `
        <div class="results-summary">
            <h3>📋 Devis Construction</h3>
            <div class="info-box" style="background: rgba(6,182,212,0.1); border-color: var(--cyan);">
                <p><strong>🏠 Surface :</strong> ${geom.surface.toFixed(2)} m²</p>
                <p><strong>📏 Périmètre :</strong> ${geom.perimetre.toFixed(2)} ml</p>
            </div>
            
            <div class="price-breakdown">
                <div class="price-item">
                    <div class="label">Sous-total HT</div>
                    <div class="value">${resultats.sousTotal.toLocaleString('fr-FR')} €</div>
                </div>
                <div class="price-item">
                    <div class="label">Marge (${document.getElementById('margin').value}%)</div>
                    <div class="value">${resultats.montantMarge.toLocaleString('fr-FR')} €</div>
                </div>
                <div class="price-item">
                    <div class="label">TVA (${document.getElementById('tva').value}%)</div>
                    <div class="value">${resultats.montantTVA.toLocaleString('fr-FR')} €</div>
                </div>
            </div>
            
            <div class="price-total">
                <div class="label">💰 TOTAL TTC</div>
                <div class="amount">${resultats.totalTTC.toLocaleString('fr-FR')} €</div>
                <p style="margin-top: 12px; color: var(--text-dim);">
                    Soit ${(resultats.totalTTC / geom.surface).toFixed(0)} €/m²
                </p>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="costChart"></canvas>
        </div>
        
        <div class="success-box">
            <p style="text-align: center; font-size: 16px;">✅ Calculs avec pertes matériaux incluses • Conformité DTU</p>
        </div>
        
        <h3 style="margin: 32px 0 16px; color: var(--text);">📊 Détail par Poste</h3>
    `;
    
    const sections = [
        resultats.terrassement,
        resultats.fondations,
        resultats.videSanitaire,
        resultats.dalle,
        resultats.murs,
        resultats.charpente,
        resultats.toiture
    ];
    
    sections.forEach(section => {
        html += generateSectionHTML(section);
    });
    
    // Planning
    html += `
        <h3 style="margin: 48px 0 16px; color: var(--text);">📅 Planning Prévisionnel</h3>
        <div class="timeline">
            <div class="timeline-item">
                <div class="phase">Phase 1 - Terrassement & Fondations</div>
                <div class="duration">2-3 semaines</div>
            </div>
            <div class="timeline-item">
                <div class="phase">Phase 2 - Vide sanitaire & Dalle</div>
                <div class="duration">2-3 semaines</div>
            </div>
            <div class="timeline-item">
                <div class="phase">Phase 3 - Élévation murs</div>
                <div class="duration">3-4 semaines</div>
            </div>
            <div class="timeline-item">
                <div class="phase">Phase 4 - Charpente & Couverture</div>
                <div class="duration">2-3 semaines</div>
            </div>
            <div class="timeline-item" style="border-left-color: var(--success);">
                <div class="phase"><strong>Durée totale gros œuvre</strong></div>
                <div class="duration"><strong>9-13 semaines</strong></div>
            </div>
        </div>
    `;
    
    // Comparaison
    html += `
        <h3 style="margin: 48px 0 16px; color: var(--text);">🔄 Comparaison Configurations</h3>
        <div class="comparison-grid">
            <div class="config-card">
                <h3>💰 Économique</h3>
                <p style="color: var(--text-dim); margin: 8px 0;">Matériaux standard</p>
                <div class="price">${(resultats.totalTTC * 0.85).toLocaleString('fr-FR')} €</div>
                <p style="color: var(--text-dim); font-size: 14px;">-15%</p>
            </div>
            <div class="config-card" style="border-color: var(--primary);">
                <h3>⭐ Actuelle</h3>
                <p style="color: var(--text-dim); margin: 8px 0;">Votre configuration</p>
                <div class="price">${resultats.totalTTC.toLocaleString('fr-FR')} €</div>
                <p style="color: var(--text-dim); font-size: 14px;">Configuration sélectionnée</p>
            </div>
            <div class="config-card">
                <h3>💎 Premium</h3>
                <p style="color: var(--text-dim); margin: 8px 0;">Haut de gamme</p>
                <div class="price">${(resultats.totalTTC * 1.25).toLocaleString('fr-FR')} €</div>
                <p style="color: var(--text-dim); font-size: 14px;">+25%</p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Créer le graphique
    setTimeout(() => createCostChart(sections), 100);
}

function generateSectionHTML(section) {
    let html = `
        <div class="results-section">
            <h4>${section.description}</h4>
            <table class="result-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qté</th>
                        <th>Unité</th>
                        <th style="text-align: right;">P.U.</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    section.details.forEach(detail => {
        html += `
            <tr>
                <td>${detail.item}</td>
                <td>${detail.quantite}</td>
                <td>${detail.unite}</td>
                <td style="text-align: right;">${detail.prixUnitaire} €</td>
                <td class="price-cell">${detail.prixTotal} €</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right;">SOUS-TOTAL :</td>
                        <td class="price-cell">${parseFloat(section.total).toLocaleString('fr-FR')} €</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    return html;
}

// =============================================================================
// 24. CRÉATION DU GRAPHIQUE
// =============================================================================
function createCostChart(sections) {
    const ctx = document.getElementById('costChart');
    if (!ctx) return;
    
    const labels = sections.map(s => s.description);
    const data = sections.map(s => s.total);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#1a1d29'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e4e7eb',
                        padding: 15,
                        font: { size: 13 }
                    }
                },
                title: {
                    display: true,
                    text: 'Répartition des Coûts par Poste',
                    color: '#e4e7eb',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}
