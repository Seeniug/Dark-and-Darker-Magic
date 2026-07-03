const inputs = {
      characterClass: document.getElementById("characterClass"),
      spell: document.getElementById("spell"),
      weaponDamage: document.getElementById("weaponDamage"),
      magicPower: document.getElementById("magicPower"),
      additionalDamage: document.getElementById("additionalDamage"),
      magicalHealing: document.getElementById("magicalHealing"),
      mdr: document.getElementById("mdr"),
      projectileReduction: document.getElementById("projectileReduction"),
      penetration: document.getElementById("penetration"),
      debuffDuration: document.getElementById("debuffDuration"),
      curseMastery: document.getElementById("curseMastery"),
      vampirism: document.getElementById("vampirism"),
      cow: document.getElementById("cow"),
      darkEnhancement: document.getElementById("darkEnhancement"),
      soulCollector: document.getElementById("soulCollector"),
      fireMastery: document.getElementById("fireMastery"),
      arcaneMastery: document.getElementById("arcaneMastery"),
      faithfulness: document.getElementById("faithfulness"),
      tortureMasterySource: document.querySelectorAll("input[name='tortureMasterySource']")
    };

    const damageList = document.getElementById("damageList");
    const mainTotal = document.getElementById("mainTotal");
    const selectedLabel = document.getElementById("selectedLabel");
    const resultTitle = document.getElementById("resultTitle");
    const classIcon = document.getElementById("classIcon");
    const spellIcon = document.getElementById("spellIcon");
    const calculatorView = document.getElementById("calculatorView");
    const hpView = document.getElementById("hpView");
    const openHpView = document.getElementById("openHpView");
    const showDamageDealt = document.getElementById("showDamageDealt");
    const backToCalculator = document.getElementById("backToCalculator");
    const targetHp = document.getElementById("targetHp");
    const skipAnimation = document.getElementById("skipAnimation");
    const hpReadout = document.getElementById("hpReadout");
    const hpBarFill = document.getElementById("hpBarFill");
    const hpBarGhost = document.getElementById("hpBarGhost");
    const warlockOptions = document.getElementById("warlockOptions");
    const wizardOptions = document.getElementById("wizardOptions");
    const clericOptions = document.getElementById("clericOptions");
    const inputFields = document.querySelectorAll("[data-input]");
    const warlockOptionFields = document.querySelectorAll("[data-option]");
    let hpDamageApplied = false;
    let hpSimulatedDamage = 0;
    let hpAnimationTimers = [];
    let selectedResultKey = "";
    let currentResults = [];

    const iconPaths = {
      classes: {
        warlock: "assets/icons/classes/warlock.png",
        wizard: "assets/icons/classes/wizard.png",
        cleric: "assets/icons/classes/cleric.png"
      }
    };

    function numberValue(input) {
      const value = Number(input.value);
      return Number.isFinite(value) ? value : 0;
    }

    function percentValue(input) {
      return numberValue(input) / 100;
    }

    function floorToOneDecimal(value) {
      return (Math.floor(value * 10) / 10).toFixed(1);
    }

    function floorToTwoDecimals(value) {
      return (Math.floor(value * 100) / 100).toFixed(2);
    }

    function getDisplayedTotal() {
      const value = Number(mainTotal.textContent);
      return Number.isFinite(value) ? value : 0;
    }

    function getSelectedResult() {
      return currentResults.find((result) => result.key === selectedResultKey);
    }

    function isSelectedResultHealing() {
      return getSelectedResult()?.effect === "healing";
    }

    function clearHpAnimation() {
      hpAnimationTimers.forEach((timer) => clearTimeout(timer));
      hpAnimationTimers = [];
    }

    function updateHpBar() {
      const hp = Math.max(1, numberValue(targetHp));
      const amount = hpDamageApplied ? Math.max(0, hpSimulatedDamage) : 0;
      const isHealing = isSelectedResultHealing();

      if (isHealing) {
        const startingHp = hp * 0.3;
        const currentHp = Math.min(hp, startingHp + amount);
        const currentPercent = Math.max(0, Math.min(100, (currentHp / hp) * 100));

        hpBarFill.style.width = `${currentPercent}%`;
        hpBarGhost.style.left = `${currentPercent}%`;
        hpBarGhost.style.width = "0%";
        hpReadout.textContent = `Healing: ${floorToOneDecimal(amount)} / HP current: ${floorToOneDecimal(currentHp)}`;
        return;
      }

      const remainingHp = Math.max(0, hp - amount);
      const remainingPercent = Math.max(0, Math.min(100, (remainingHp / hp) * 100));
      const damagePercent = Math.max(0, Math.min(100, (Math.min(amount, hp) / hp) * 100));
      const ghostPercent = hpDamageApplied ? Math.min(100 - remainingPercent, damagePercent * 0.65) : 0;

      hpBarFill.style.width = `${remainingPercent}%`;
      hpBarGhost.style.left = `${remainingPercent}%`;
      hpBarGhost.style.width = `${ghostPercent}%`;
      hpReadout.textContent = `Damage: ${floorToOneDecimal(amount)} / HP remaining: ${floorToOneDecimal(remainingHp)}`;
    }

    function showHpView() {
      calculatorView.classList.add("hidden");
      hpView.classList.remove("hidden");
      clearHpAnimation();
      hpDamageApplied = false;
      hpSimulatedDamage = 0;
      updateHpBar();
    }

    function showCalculatorView() {
      clearHpAnimation();
      hpView.classList.add("hidden");
      calculatorView.classList.remove("hidden");
    }

    function applyHpDamage() {
      const selectedResult = getSelectedResult();
      const events = selectedResult?.events?.length
        ? selectedResult.events
        : [{ damage: getDisplayedTotal(), delayMs: 0 }];

      clearHpAnimation();
      hpDamageApplied = true;
      hpSimulatedDamage = 0;
      updateHpBar();

      if (skipAnimation.checked) {
        hpSimulatedDamage = Math.max(0, getDisplayedTotal());
        updateHpBar();
        return;
      }

      let elapsedMs = 0;
      events.forEach((event) => {
        elapsedMs += event.delayMs || 0;

        const timer = setTimeout(() => {
          hpSimulatedDamage += event.damage;
          updateHpBar();
        }, elapsedMs);

        hpAnimationTimers.push(timer);
      });
    }

    function resetHpSimulation() {
      clearHpAnimation();
      hpDamageApplied = false;
      hpSimulatedDamage = 0;
      updateHpBar();
    }

    function skipActiveHpAnimation() {
      if (!skipAnimation.checked || !hpDamageApplied) {
        return;
      }

      clearHpAnimation();
      hpSimulatedDamage = Math.max(0, getDisplayedTotal());
      updateHpBar();
    }

    function applyDefaultValues() {
      inputs.weaponDamage.value = 6;
      inputs.magicPower.value = 20;
      inputs.additionalDamage.value = 5;
      inputs.magicalHealing.value = 10;
      inputs.mdr.value = 0;
      inputs.projectileReduction.value = 0;
      inputs.penetration.value = 5;
      inputs.debuffDuration.value = 0;
      inputs.curseMastery.checked = false;
      inputs.vampirism.checked = false;
      inputs.cow.checked = false;
      inputs.darkEnhancement.checked = false;
      inputs.soulCollector.value = 0;
      inputs.fireMastery.checked = false;
      inputs.arcaneMastery.checked = false;
      inputs.faithfulness.checked = false;
      inputs.tortureMasterySource.forEach((input) => {
        input.checked = input.value === "curse";
      });
    }

    function getCurrentSpell() {
      const spells = classSpells[inputs.characterClass.value];
      return spells.find((spell) => spell.id === inputs.spell.value) || spells[0];
    }

    function setIcon(image, src) {
      if (!image || !src) {
        return;
      }

      image.classList.add("hidden");
      image.onload = () => image.classList.remove("hidden");
      image.onerror = () => image.classList.add("hidden");
      image.src = src;
    }

    function getSpellIconPath(spell) {
      const iconName = spell.id.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      return spell.icon || `assets/icons/spells/${iconName}.png`;
    }

    function updateSelectIcons() {
      setIcon(classIcon, iconPaths.classes[inputs.characterClass.value]);
      setIcon(spellIcon, getSpellIconPath(getCurrentSpell()));
    }

    function updateSpellOptions() {
      const spells = classSpells[inputs.characterClass.value];
      inputs.spell.innerHTML = spells.map((spell) => (
        `<option value="${spell.id}">${spell.label}</option>`
      )).join("");
      warlockOptions.classList.toggle("visible", inputs.characterClass.value === "warlock");
      wizardOptions.classList.toggle("visible", inputs.characterClass.value === "wizard");
      clericOptions.classList.toggle("visible", inputs.characterClass.value === "cleric");
      updateSelectIcons();
    }

    function updateVisibleInputs(spell) {
      const visibleInputs = new Set(spell.visibleInputs || []);

      inputFields.forEach((field) => {
        field.classList.toggle("hidden", !visibleInputs.has(field.dataset.input));
      });

      warlockOptionFields.forEach((field) => {
        field.classList.toggle("hidden", !visibleInputs.has(field.dataset.option));
      });

      const warlockHasVisibleOptions = Boolean(warlockOptions.querySelector("[data-option]:not(.hidden)"));
      const wizardHasVisibleOptions = Boolean(wizardOptions.querySelector("[data-option]:not(.hidden)"));
      const clericHasVisibleOptions = Boolean(clericOptions.querySelector("[data-option]:not(.hidden)"));
      warlockOptions.classList.toggle("visible", inputs.characterClass.value === "warlock" && warlockHasVisibleOptions);
      wizardOptions.classList.toggle("visible", inputs.characterClass.value === "wizard" && wizardHasVisibleOptions);
      clericOptions.classList.toggle("visible", inputs.characterClass.value === "cleric" && clericHasVisibleOptions);
    }

    function getEffectiveMdrMultiplier() {
      const magicDamageReduction = getCowAdjustedMdr();
      const magicPenetration = percentValue(inputs.penetration);
      const effectiveMdr = magicDamageReduction * (1 - magicPenetration);
      return 1 - effectiveMdr;
    }

    function isCowActive() {
      const spell = getCurrentSpell();
      const visibleInputs = spell.visibleInputs || [];
      return inputs.characterClass.value === "warlock"
        && visibleInputs.includes("cow")
        && inputs.cow.checked;
    }

    function getCowAdjustedMdr() {
      const magicDamageReduction = percentValue(inputs.mdr);
      return isCowActive() ? magicDamageReduction * 0.85 : magicDamageReduction;
    }

    function getSelectedTortureMasterySource() {
      return Array.from(inputs.tortureMasterySource).find((input) => input.checked)?.value || "curse";
    }

    function isFireMasteryActive(spell) {
      return inputs.characterClass.value === "wizard" && spell.fireMastery && inputs.fireMastery.checked;
    }

    function isArcaneMasteryActive(spell) {
      return inputs.characterClass.value === "wizard" && spell.arcaneMastery && inputs.arcaneMastery.checked;
    }

    function isFaithfulnessActive(spell) {
      return inputs.characterClass.value === "cleric" && spell.faithfulness && inputs.faithfulness.checked;
    }

    function isDarkEnhancementActive(spell) {
      return inputs.characterClass.value === "warlock" && spell.darkEnhancement && inputs.darkEnhancement.checked;
    }

    function getSoulCollectorStacks(spell) {
      if (inputs.characterClass.value !== "warlock" || !spell.soulCollector) {
        return 0;
      }

      return Math.min(3, Math.max(0, Math.floor(numberValue(inputs.soulCollector))));
    }

    function calculateDamage(spell, locationBonus, options = {}) {
      const scaling = spell.scaling;
      const baseDamage = spell.baseDamage + (options.extraBaseDamage || 0);
      const magicalWeaponDamage = numberValue(inputs.weaponDamage);
      const magicPowerBonus = percentValue(inputs.magicPower)
        + (options.fireMastery ? 0.05 : 0)
        + (options.arcaneMastery ? 0.05 : 0)
        + (options.faithfulness ? 0.15 : 0)
        + (options.darkEnhancement ? 0.2 : 0)
        + ((options.soulCollectorStacks || 0) * 0.33);
      const additionalMagicalDamage = numberValue(inputs.additionalDamage);
      const magicDamageReduction = getCowAdjustedMdr();
      const projectileReduction = spell.isProjectile ? percentValue(inputs.projectileReduction) : 0;
      const magicPenetration = percentValue(inputs.penetration);
      const hitBonus = spell.isProjectile || options.useHitLocation ? locationBonus : 0;

      const scaledBase = baseDamage + (magicalWeaponDamage * scaling);
      const poweredDamage = scaledBase * (1 + (magicPowerBonus * scaling));
      const addedDamage = additionalMagicalDamage * scaling;
      const effectiveMdr = magicDamageReduction * (1 - magicPenetration);

      return (poweredDamage + addedDamage)
        * (1 + hitBonus)
        * (1 - effectiveMdr)
        * (1 - projectileReduction);
    }

    function calculateHealing(spell) {
      const scaling = spell.scaling;
      const magicPowerBonus = percentValue(inputs.magicPower);
      const magicalHealing = numberValue(inputs.magicalHealing);
      return (spell.baseHealing + (magicalHealing * scaling)) * (1 + (magicPowerBonus * scaling));
    }

    function getEffectiveDotDuration(baseDuration, usesFireMastery) {
      const extraDuration = usesFireMastery ? 2 : 0;
      return baseDuration + extraDuration;
    }

    function getWizardBurnTickDamage(dotSpell, fireMasteryActive) {
      const baseDuration = dotSpell.durationSeconds;
      const totalDuration = getEffectiveDotDuration(baseDuration, fireMasteryActive);
      const extraBaseDamage = fireMasteryActive ? (dotSpell.fireMasteryBaseBonus || 0) : 0;
      const totalBurnDamage = calculateDamage(dotSpell, 0, {
        fireMastery: fireMasteryActive,
        extraBaseDamage
      }) * baseDuration;

      return totalBurnDamage / totalDuration;
    }

    function getInitialHitLabel(spell) {
      return inputs.characterClass.value === "wizard" ? "Initial Hit" : `${spell.name} Initial Hit`;
    }

    function getBurnTotalLabel(spell) {
      return inputs.characterClass.value === "wizard" ? "Burn Damage" : `${spell.name} Damage Over Time`;
    }

    function getBurnTickLabel(spell) {
      return inputs.characterClass.value === "wizard" ? "Burn Tick Damage" : `${spell.name} Tick Damage`;
    }

    function buildSingleEvent(damage) {
      return [{ damage, delayMs: 0 }];
    }

    function getCompletedTicks(rawTicks) {
      const tickGrace = 0.05;
      return Math.floor(Math.max(0, rawTicks) + tickGrace);
    }

    function getDebuffAdjustedTicks(totalDuration, debuffDurationReduction, tickInterval = 1) {
      const baseTicks = getCompletedTicks(totalDuration / tickInterval);

      if (debuffDurationReduction <= 0) {
        return getCompletedTicks((totalDuration * (1 - debuffDurationReduction)) / tickInterval);
      }

      const removedTicks = getCompletedTicks((totalDuration * debuffDurationReduction) / tickInterval);
      return Math.max(0, baseTicks - removedTicks);
    }

    function buildTickEvents(tickDamage, effectiveTicks, intervalMs, firstDelayMs = 0) {
      const events = [];
      const fullTicks = getCompletedTicks(effectiveTicks);

      for (let index = 0; index < fullTicks; index += 1) {
        events.push({
          damage: tickDamage,
          delayMs: index === 0 ? firstDelayMs : intervalMs
        });
      }

      return events;
    }

    function buildInitialAndTickEvents(initialDamage, tickDamage, effectiveTicks, intervalMs) {
      return [
        { damage: initialDamage, delayMs: 0 },
        ...buildTickEvents(tickDamage, effectiveTicks, intervalMs, intervalMs)
      ];
    }

    function getDefaultResultKey(spell, results) {
      if (spell.type === "fireball") {
        return results.find((result) => result.kind === "directTotal")?.key;
      }

      if (spell.type === "magicMissile") {
        return results.find((result) => result.kind === "totalMissile")?.key;
      }

      if (spell.type === "chainLightning") {
        return results.find((result) => result.kind === "totalChain")?.key;
      }

      if (spell.type === "ignite") {
        return results.find((result) => result.kind === "igniteBodyTotal")?.key;
      }

      if (spell.dot) {
        return results.find((result) => result.kind === "combinedDot")?.key;
      }

      if (spell.isProjectile) {
        return results.find((result) => result.name === "Body")?.key;
      }

      return results[0]?.key;
    }

    function selectResult(resultKey) {
      selectedResultKey = resultKey;
      const selectedResult = currentResults.find((result) => result.key === selectedResultKey);

      if (!selectedResult) {
        return;
      }

      selectedLabel.textContent = selectedResult.name;
      mainTotal.textContent = selectedResult.tickOnly
        ? floorToTwoDecimals(selectedResult.damage)
        : floorToOneDecimal(selectedResult.damage);

      damageList.querySelectorAll(".damage-row").forEach((row) => {
        row.classList.toggle("primary", row.dataset.resultKey === selectedResultKey);
      });

      updateHpBar();
    }

    function prepareSelectableResults(spell, results) {
      currentResults = results.map((result, index) => ({
        ...result,
        key: `${spell.id}-${result.kind || index}-${result.name}`
      }));

      if (!currentResults.some((result) => result.key === selectedResultKey)) {
        selectedResultKey = getDefaultResultKey(spell, currentResults) || currentResults[0]?.key || "";
      }

      return currentResults;
    }

    function renderResults() {
      const spell = getCurrentSpell();
      const debuffDurationReduction = percentValue(inputs.debuffDuration);
      updateVisibleInputs(spell);
      const isHealingSpell = spell.type === "healingOverTime"
        || spell.type === "instantHealing"
        || spell.type === "clericHealingOverTime";
      resultTitle.textContent = isHealingSpell ? "Total Healing" : "Total Damage Dealt";
      let results;
      const fireMasteryActive = isFireMasteryActive(spell);
      const arcaneMasteryActive = isArcaneMasteryActive(spell);
      const faithfulnessActive = isFaithfulnessActive(spell);
      const darkEnhancementActive = isDarkEnhancementActive(spell);
      const soulCollectorStacks = getSoulCollectorStacks(spell);

      if (spell.type === "magicMissile") {
        const perMissileDamage = calculateDamage(spell, 0, { arcaneMastery: arcaneMasteryActive });
        const totalMissileDamage = perMissileDamage * spell.missileCount;

        results = [
          {
            name: "Per Missile Damage",
            bonus: 0,
            damage: perMissileDamage,
            events: buildSingleEvent(perMissileDamage)
          },
          {
            name: "Total Missile Damage",
            bonus: 0,
            damage: totalMissileDamage,
            kind: "totalMissile",
            events: buildTickEvents(perMissileDamage, spell.missileCount, 300, 0)
          }
        ];
      } else if (spell.type === "chainLightning") {
        const hitResults = spell.hits.map((hit) => ({
          name: hit.name,
          bonus: 0,
          damage: calculateDamage({
            baseDamage: hit.baseDamage,
            scaling: spell.scaling,
            isProjectile: false
          }, 0)
        }));
        const totalDamage = hitResults.reduce((total, result) => total + result.damage, 0);

        results = [
          ...hitResults,
          {
            name: "Total Chain Damage",
            bonus: 0,
            damage: totalDamage,
            kind: "totalChain",
            events: hitResults.map((result, index) => ({
              damage: result.damage,
              delayMs: index === 0 ? 0 : 300
            }))
          }
        ];
      } else if (spell.type === "ignite") {
        const igniteLocations = hitLocations.filter((location) => location.name === "Head" || location.name === "Body");
        const dotDuration = getEffectiveDotDuration(spell.dot.durationSeconds, fireMasteryActive);
        const effectiveTicks = getDebuffAdjustedTicks(dotDuration, debuffDurationReduction);
        const extraBaseDamage = fireMasteryActive ? (spell.dot.fireMasteryBaseBonus || 0) : 0;

        results = igniteLocations.flatMap((location) => {
          const initialDamage = calculateDamage(spell.initial, location.bonus, {
            fireMastery: fireMasteryActive,
            useHitLocation: true
          });
          const totalBurnDamage = calculateDamage(spell.dot, location.bonus, {
            fireMastery: fireMasteryActive,
            extraBaseDamage,
            useHitLocation: true
          }) * spell.dot.durationSeconds;
          const tickDamage = totalBurnDamage / dotDuration;
          const burnDamage = tickDamage * effectiveTicks;
          const tickEvents = buildTickEvents(tickDamage, effectiveTicks, 1000, 0);
          const initialEvents = buildSingleEvent(initialDamage);
          const combinedEvents = buildInitialAndTickEvents(initialDamage, tickDamage, effectiveTicks, 1000);

          return [
            {
              name: `Initial Hit: ${location.name}`,
              bonus: location.bonus,
              damage: initialDamage,
              isProjectileResult: true,
              events: initialEvents
            },
            {
              name: `Burn Damage: ${location.name}`,
              bonus: location.bonus,
              damage: burnDamage,
              isProjectileResult: true,
              events: tickEvents
            },
            {
              name: `Initial Hit + Burn Damage: ${location.name}`,
              bonus: location.bonus,
              damage: initialDamage + burnDamage,
              isProjectileResult: true,
              kind: location.name === "Body" ? "igniteBodyTotal" : "igniteLocationTotal",
              events: combinedEvents
            }
          ];
        });
      } else if (spell.type === "fireball") {
        const dotDuration = getEffectiveDotDuration(spell.dot.durationSeconds, fireMasteryActive);
        const tickDamage = getWizardBurnTickDamage(spell.dot, fireMasteryActive);
        const effectiveTicks = getDebuffAdjustedTicks(dotDuration, debuffDurationReduction);

        results = [
          ...hitLocations.map((location) => ({
            name: `${spell.direct.name}: ${location.name}`,
            bonus: location.bonus,
            damage: calculateDamage(spell.direct, location.bonus, { fireMastery: fireMasteryActive }),
            isProjectileResult: true,
            kind: location.name === "Body" ? "directBody" : "directLocation",
            events: buildSingleEvent(calculateDamage(spell.direct, location.bonus, { fireMastery: fireMasteryActive }))
          })),
          {
            name: spell.splash.name,
            bonus: 0,
            damage: calculateDamage(spell.splash, 0, { fireMastery: fireMasteryActive }),
            kind: "splash",
            events: buildSingleEvent(calculateDamage(spell.splash, 0, { fireMastery: fireMasteryActive }))
          },
          {
            name: spell.dot.name,
            bonus: 0,
            damage: tickDamage * effectiveTicks,
            kind: "burnTotal",
            events: buildTickEvents(tickDamage, effectiveTicks, 1000, 0)
          },
          {
            name: "Direct Hit + Burn Damage",
            bonus: 0,
            damage: calculateDamage(spell.direct, 0, { fireMastery: fireMasteryActive }) + (tickDamage * effectiveTicks),
            kind: "directTotal",
            events: buildInitialAndTickEvents(
              calculateDamage(spell.direct, 0, { fireMastery: fireMasteryActive }),
              tickDamage,
              effectiveTicks,
              1000
            )
          },
          {
            name: "Splash Damage + Burn Damage",
            bonus: 0,
            damage: calculateDamage(spell.splash, 0, { fireMastery: fireMasteryActive }) + (tickDamage * effectiveTicks),
            kind: "splashTotal",
            events: buildInitialAndTickEvents(
              calculateDamage(spell.splash, 0, { fireMastery: fireMasteryActive }),
              tickDamage,
              effectiveTicks,
              1000
            )
          },
          {
            name: "Burn Tick Damage",
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks,
            kind: "burnTick",
            events: buildSingleEvent(tickDamage)
          }
        ];
      } else if (spell.isProjectile) {
        results = hitLocations.map((location) => ({
          ...location,
          damage: calculateDamage(spell, location.bonus, {
            fireMastery: fireMasteryActive,
            faithfulness: faithfulnessActive,
            darkEnhancement: darkEnhancementActive,
            soulCollectorStacks
          }),
          isProjectileResult: true
        }));
      } else if (spell.dot) {
        const isWarlockDot = inputs.characterClass.value === "warlock";
        const durationMultiplier = isWarlockDot && inputs.curseMastery.checked ? 1.3 : 1;
        const totalDuration = getEffectiveDotDuration(spell.dot.durationSeconds * durationMultiplier, fireMasteryActive);
        const dotDamage = calculateDamage(spell.dot, 0, { fireMastery: fireMasteryActive });
        const tickDamage = inputs.characterClass.value === "wizard" && spell.dot.perSecond
          ? getWizardBurnTickDamage(spell.dot, fireMasteryActive)
          : spell.dot.perSecond ? dotDamage : dotDamage / spell.dot.durationSeconds;
        const effectiveTicks = getDebuffAdjustedTicks(totalDuration, debuffDurationReduction);

        results = [
          {
            name: getInitialHitLabel(spell),
            bonus: 0,
            damage: calculateDamage(spell, 0, { fireMastery: fireMasteryActive }),
            kind: "initialHit",
            events: buildSingleEvent(calculateDamage(spell, 0, { fireMastery: fireMasteryActive }))
          },
          {
            name: getBurnTotalLabel(spell),
            bonus: 0,
            damage: tickDamage * effectiveTicks,
            kind: "dotTotal",
            events: buildTickEvents(tickDamage, effectiveTicks, 1000, 0)
          },
          {
            name: inputs.characterClass.value === "wizard" ? "Initial Hit + Burn Damage" : "Initial Hit + Damage Over Time",
            bonus: 0,
            damage: calculateDamage(spell, 0, { fireMastery: fireMasteryActive }) + (tickDamage * effectiveTicks),
            kind: "combinedDot",
            events: buildInitialAndTickEvents(
              calculateDamage(spell, 0, { fireMastery: fireMasteryActive }),
              tickDamage,
              effectiveTicks,
              1000
            )
          },
          {
            name: getBurnTickLabel(spell),
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks,
            events: buildSingleEvent(tickDamage)
          }
        ];
      } else if (spell.type === "healingOverTime") {
        const source = getSelectedTortureMasterySource();
        const baseDuration = source === "sacrifice" ? 12 : 8;
        const durationMultiplier = inputs.curseMastery.checked ? 1.3 : 1;
        const totalDuration = baseDuration * durationMultiplier;
        const effectiveTicks = getCompletedTicks(totalDuration * (1 - debuffDurationReduction));
        const magicPowerBonus = percentValue(inputs.magicPower);
        const magicalHealing = numberValue(inputs.magicalHealing);
        const vampirismMultiplier = inputs.vampirism.checked ? 1.2 : 1;
        const healingPerTick = (2 + (magicalHealing * 0.15)) * (1 + (magicPowerBonus * 0.15)) * vampirismMultiplier;
        const totalHealing = healingPerTick * effectiveTicks;

        results = [
          {
            name: `${spell.name} Total Healing`,
            bonus: 0,
            damage: totalHealing,
            effect: "healing",
            events: buildTickEvents(healingPerTick, effectiveTicks, 1000, 0)
          },
          {
            name: `${spell.name} Healing Per Tick`,
            bonus: 0,
            damage: healingPerTick,
            effect: "healing",
            tickOnly: true,
            effectiveTicks,
            events: buildSingleEvent(healingPerTick)
          }
        ];
      } else if (spell.type === "instantHealing") {
        const healing = calculateHealing(spell);

        results = [
          {
            name: spell.name,
            bonus: 0,
            damage: healing,
            effect: "healing",
            events: buildSingleEvent(healing)
          }
        ];
      } else if (spell.type === "clericHealingOverTime") {
        const healingPerTick = calculateHealing(spell);
        const effectiveTicks = getCompletedTicks(spell.durationSeconds);
        const totalHealing = healingPerTick * effectiveTicks;

        results = [
          {
            name: `${spell.name} Total Healing`,
            bonus: 0,
            damage: totalHealing,
            effect: "healing",
            events: buildTickEvents(healingPerTick, effectiveTicks, 1000, 0)
          },
          {
            name: `${spell.name} Healing Per Tick`,
            bonus: 0,
            damage: healingPerTick,
            effect: "healing",
            tickOnly: true,
            effectiveTicks,
            events: buildSingleEvent(healingPerTick)
          }
        ];
      } else if (spell.type === "clericDamageOverTime") {
        const totalDuration = spell.durationSeconds;
        const effectiveTicks = spell.ignoresDebuffDuration
          ? getCompletedTicks(totalDuration / spell.tickInterval)
          : getDebuffAdjustedTicks(totalDuration, debuffDurationReduction, spell.tickInterval);
        const damagePerSecond = calculateDamage(spell, 0, { faithfulness: faithfulnessActive });
        const tickDamage = damagePerSecond * spell.tickInterval;
        const totalDamage = tickDamage * effectiveTicks;

        results = [
          {
            name: `${spell.name} Total Damage`,
            bonus: 0,
            damage: totalDamage,
            events: buildTickEvents(tickDamage, effectiveTicks, spell.tickInterval * 1000, 0)
          },
          {
            name: `${spell.name} Tick Damage`,
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks,
            hideTickCount: spell.id === "locustSwarm",
            events: buildSingleEvent(tickDamage)
          }
        ];
      } else if (spell.type === "damageOverTime") {
        const durationMultiplier = inputs.curseMastery.checked ? 1.3 : 1;
        const totalDuration = spell.durationSeconds * durationMultiplier;
        const effectiveTicks = getDebuffAdjustedTicks(totalDuration, debuffDurationReduction);
        const tickDamage = spell.damagePerSecond * getEffectiveMdrMultiplier();
        const totalDamage = tickDamage * effectiveTicks;

        results = [
          {
            name: `${spell.name} Damage Over Time`,
            bonus: 0,
            damage: totalDamage,
            events: buildTickEvents(tickDamage, effectiveTicks, 1000, 0)
          },
          {
            name: `${spell.name} Tick Damage`,
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks,
            events: buildSingleEvent(tickDamage)
          }
        ];
      } else if (spell.type === "formulaNeeded") {
        results = [
          {
            name: spell.name,
            bonus: 0,
            damage: 0,
            note: "Formula needed",
            events: buildSingleEvent(0)
          }
        ];
      } else {
        results = [
          {
            name: spell.name,
            bonus: 0,
            damage: calculateDamage(spell, 0, { faithfulness: faithfulnessActive }),
            events: buildSingleEvent(calculateDamage(spell, 0, { faithfulness: faithfulnessActive }))
          }
        ];
      }

      results = prepareSelectableResults(spell, results);

      damageList.innerHTML = results.map((result) => {
        const bonusText = result.bonus === 0
          ? "+0%"
          : `${result.bonus > 0 ? "+" : ""}${Math.round(result.bonus * 100)}%`;
        const hitLocationText = result.isProjectileResult
          ? `<span>Hit location bonus: ${bonusText}</span>`
          : "";
        const tickText = result.tickOnly && !result.hideTickCount
          ? `<span>Active ticks after debuff duration: ${result.effectiveTicks}</span>`
          : "";
        const noteText = result.note
          ? `<span>${result.note}</span>`
          : "";
        const damageText = result.tickOnly
          ? floorToTwoDecimals(result.damage)
          : floorToOneDecimal(result.damage);

        return `
          <div class="damage-row ${result.key === selectedResultKey ? "primary" : ""}" data-result-key="${result.key}">
            <div class="part">
              <strong>${result.name}</strong>
              ${hitLocationText}
              ${tickText}
              ${noteText}
            </div>
            <div class="damage">${damageText}</div>
          </div>
        `;
      }).join("");

      selectResult(selectedResultKey);
    }

    Object.values(inputs).forEach((input) => {
      if (input instanceof NodeList) {
        input.forEach((item) => {
          item.addEventListener("input", renderResults);
          item.addEventListener("change", renderResults);
        });
        return;
      }

      input.addEventListener("input", renderResults);
      input.addEventListener("change", renderResults);
    });

    inputs.characterClass.addEventListener("change", () => {
      updateSpellOptions();
      renderResults();
    });

    inputs.spell.addEventListener("change", updateSelectIcons);

    damageList.addEventListener("click", (event) => {
      const row = event.target.closest(".damage-row");

      if (!row) {
        return;
      }

      selectResult(row.dataset.resultKey);
    });

    openHpView.addEventListener("click", showHpView);
    showDamageDealt.addEventListener("click", applyHpDamage);
    backToCalculator.addEventListener("click", showCalculatorView);
    targetHp.addEventListener("input", resetHpSimulation);
    targetHp.addEventListener("change", resetHpSimulation);
    skipAnimation.addEventListener("change", skipActiveHpAnimation);

    applyDefaultValues();
    updateSpellOptions();
    updateSelectIcons();
    renderResults();
