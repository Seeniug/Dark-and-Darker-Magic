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
      fireMastery: document.getElementById("fireMastery"),
      faithfulness: document.getElementById("faithfulness"),
      tortureMasterySource: document.querySelectorAll("input[name='tortureMasterySource']")
    };

    const damageList = document.getElementById("damageList");
    const mainTotal = document.getElementById("mainTotal");
    const selectedLabel = document.getElementById("selectedLabel");
    const resultTitle = document.getElementById("resultTitle");
    const calculatorView = document.getElementById("calculatorView");
    const hpView = document.getElementById("hpView");
    const openHpView = document.getElementById("openHpView");
    const showDamageDealt = document.getElementById("showDamageDealt");
    const backToCalculator = document.getElementById("backToCalculator");
    const targetHp = document.getElementById("targetHp");
    const hpReadout = document.getElementById("hpReadout");
    const hpBarFill = document.getElementById("hpBarFill");
    const hpBarGhost = document.getElementById("hpBarGhost");
    const warlockOptions = document.getElementById("warlockOptions");
    const wizardOptions = document.getElementById("wizardOptions");
    const clericOptions = document.getElementById("clericOptions");
    const inputFields = document.querySelectorAll("[data-input]");
    const warlockOptionFields = document.querySelectorAll("[data-option]");
    let hpDamageApplied = false;

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

    function updateHpBar() {
      const hp = Math.max(1, numberValue(targetHp));
      const damage = hpDamageApplied ? Math.max(0, getDisplayedTotal()) : 0;
      const remainingHp = Math.max(0, hp - damage);
      const remainingPercent = Math.max(0, Math.min(100, (remainingHp / hp) * 100));
      const damagePercent = Math.max(0, Math.min(100, (Math.min(damage, hp) / hp) * 100));
      const ghostPercent = hpDamageApplied ? Math.min(100 - remainingPercent, damagePercent * 0.65) : 0;

      hpBarFill.style.width = `${remainingPercent}%`;
      hpBarGhost.style.left = `${remainingPercent}%`;
      hpBarGhost.style.width = `${ghostPercent}%`;
      hpReadout.textContent = `Damage: ${floorToOneDecimal(damage)} / HP remaining: ${floorToOneDecimal(remainingHp)}`;
    }

    function showHpView() {
      calculatorView.classList.add("hidden");
      hpView.classList.remove("hidden");
      hpDamageApplied = false;
      updateHpBar();
    }

    function showCalculatorView() {
      hpView.classList.add("hidden");
      calculatorView.classList.remove("hidden");
    }

    function applyHpDamage() {
      hpDamageApplied = true;
      updateHpBar();
    }

    function resetHpSimulation() {
      hpDamageApplied = false;
      updateHpBar();
    }

    function applyDefaultValues() {
      inputs.weaponDamage.value = 6;
      inputs.magicPower.value = 20;
      inputs.additionalDamage.value = 5;
      inputs.magicalHealing.value = 0;
      inputs.mdr.value = 0;
      inputs.projectileReduction.value = 0;
      inputs.penetration.value = 5;
      inputs.debuffDuration.value = 0;
      inputs.curseMastery.checked = false;
      inputs.vampirism.checked = false;
      inputs.cow.checked = false;
      inputs.fireMastery.checked = false;
      inputs.faithfulness.checked = false;
      inputs.tortureMasterySource.forEach((input) => {
        input.checked = input.value === "curse";
      });
    }

    function getCurrentSpell() {
      const spells = classSpells[inputs.characterClass.value];
      return spells.find((spell) => spell.id === inputs.spell.value) || spells[0];
    }

    function updateSpellOptions() {
      const spells = classSpells[inputs.characterClass.value];
      inputs.spell.innerHTML = spells.map((spell) => (
        `<option value="${spell.id}">${spell.label}</option>`
      )).join("");
      warlockOptions.classList.toggle("visible", inputs.characterClass.value === "warlock");
      wizardOptions.classList.toggle("visible", inputs.characterClass.value === "wizard");
      clericOptions.classList.toggle("visible", inputs.characterClass.value === "cleric");
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

    function isFaithfulnessActive(spell) {
      return inputs.characterClass.value === "cleric" && spell.faithfulness && inputs.faithfulness.checked;
    }

    function calculateDamage(spell, locationBonus, options = {}) {
      const scaling = spell.scaling;
      const baseDamage = spell.baseDamage + (options.extraBaseDamage || 0);
      const magicalWeaponDamage = numberValue(inputs.weaponDamage);
      const magicPowerBonus = percentValue(inputs.magicPower)
        + (options.fireMastery ? 0.05 : 0)
        + (options.faithfulness ? 0.15 : 0);
      const additionalMagicalDamage = numberValue(inputs.additionalDamage);
      const magicDamageReduction = getCowAdjustedMdr();
      const projectileReduction = spell.isProjectile ? percentValue(inputs.projectileReduction) : 0;
      const magicPenetration = percentValue(inputs.penetration);
      const hitBonus = spell.isProjectile ? locationBonus : 0;

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

    function renderResults() {
      const spell = getCurrentSpell();
      const debuffDurationReduction = Math.max(0, percentValue(inputs.debuffDuration));
      updateVisibleInputs(spell);
      const isHealingSpell = spell.type === "healingOverTime"
        || spell.type === "instantHealing"
        || spell.type === "clericHealingOverTime";
      resultTitle.textContent = isHealingSpell ? "Total Healing" : "Total Damage Dealt";
      let results;
      const fireMasteryActive = isFireMasteryActive(spell);
      const faithfulnessActive = isFaithfulnessActive(spell);

      if (spell.type === "fireball") {
        const dotDuration = getEffectiveDotDuration(spell.dot.durationSeconds, fireMasteryActive);
        const tickDamage = getWizardBurnTickDamage(spell.dot, fireMasteryActive);
        const effectiveTicks = Math.max(0, dotDuration * (1 - debuffDurationReduction));

        results = [
          ...hitLocations.map((location) => ({
            name: `${spell.direct.name}: ${location.name}`,
            bonus: location.bonus,
            damage: calculateDamage(spell.direct, location.bonus, { fireMastery: fireMasteryActive }),
            isProjectileResult: true,
            kind: location.name === "Body" ? "directBody" : "directLocation"
          })),
          {
            name: spell.splash.name,
            bonus: 0,
            damage: calculateDamage(spell.splash, 0, { fireMastery: fireMasteryActive }),
            kind: "splash"
          },
          {
            name: spell.dot.name,
            bonus: 0,
            damage: tickDamage * effectiveTicks,
            kind: "burnTotal"
          },
          {
            name: "Direct Hit + Burn Damage",
            bonus: 0,
            damage: calculateDamage(spell.direct, 0, { fireMastery: fireMasteryActive }) + (tickDamage * effectiveTicks),
            kind: "directTotal"
          },
          {
            name: "Splash Damage + Burn Damage",
            bonus: 0,
            damage: calculateDamage(spell.splash, 0, { fireMastery: fireMasteryActive }) + (tickDamage * effectiveTicks),
            kind: "splashTotal"
          },
          {
            name: "Burn Tick Damage",
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks,
            kind: "burnTick"
          }
        ];
      } else if (spell.isProjectile) {
        results = hitLocations.map((location) => ({
          ...location,
          damage: calculateDamage(spell, location.bonus, {
            fireMastery: fireMasteryActive,
            faithfulness: faithfulnessActive
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
          : spell.dot.perSecond ? dotDamage : dotDamage / (spell.dot.durationSeconds * durationMultiplier);
        const effectiveTicks = Math.max(0, totalDuration * (1 - debuffDurationReduction));

        results = [
          {
            name: getInitialHitLabel(spell),
            bonus: 0,
            damage: calculateDamage(spell, 0, { fireMastery: fireMasteryActive })
          },
          {
            name: getBurnTotalLabel(spell),
            bonus: 0,
            damage: tickDamage * effectiveTicks
          },
          {
            name: getBurnTickLabel(spell),
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks
          }
        ];
      } else if (spell.type === "healingOverTime") {
        const source = getSelectedTortureMasterySource();
        const baseDuration = source === "sacrifice" ? 12 : 8;
        const durationMultiplier = inputs.curseMastery.checked ? 1.3 : 1;
        const totalDuration = baseDuration * durationMultiplier;
        const effectiveTicks = Math.max(0, totalDuration * (1 - debuffDurationReduction));
        const magicPowerBonus = percentValue(inputs.magicPower);
        const magicalHealing = numberValue(inputs.magicalHealing);
        const vampirismMultiplier = inputs.vampirism.checked ? 1.2 : 1;
        const healingPerTick = (2 + (magicalHealing * 0.15)) * (1 + (magicPowerBonus * 0.15)) * vampirismMultiplier;
        const totalHealing = healingPerTick * effectiveTicks;

        results = [
          {
            name: `${spell.name} Total Healing`,
            bonus: 0,
            damage: totalHealing
          },
          {
            name: `${spell.name} Healing Per Tick`,
            bonus: 0,
            damage: healingPerTick,
            tickOnly: true,
            effectiveTicks
          }
        ];
      } else if (spell.type === "instantHealing") {
        const healing = calculateHealing(spell);

        results = [
          {
            name: spell.name,
            bonus: 0,
            damage: healing
          }
        ];
      } else if (spell.type === "clericHealingOverTime") {
        const healingPerTick = calculateHealing(spell);
        const effectiveTicks = spell.durationSeconds;
        const totalHealing = healingPerTick * effectiveTicks;

        results = [
          {
            name: `${spell.name} Total Healing`,
            bonus: 0,
            damage: totalHealing
          },
          {
            name: `${spell.name} Healing Per Tick`,
            bonus: 0,
            damage: healingPerTick,
            tickOnly: true,
            effectiveTicks
          }
        ];
      } else if (spell.type === "clericDamageOverTime") {
        const debuffMultiplier = spell.ignoresDebuffDuration ? 1 : (1 - debuffDurationReduction);
        const totalDuration = Math.max(0, spell.durationSeconds * debuffMultiplier);
        const effectiveTicks = totalDuration / spell.tickInterval;
        const damagePerSecond = calculateDamage(spell, 0, { faithfulness: faithfulnessActive });
        const tickDamage = damagePerSecond * spell.tickInterval;
        const totalDamage = tickDamage * effectiveTicks;

        results = [
          {
            name: `${spell.name} Total Damage`,
            bonus: 0,
            damage: totalDamage
          },
          {
            name: `${spell.name} Tick Damage`,
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks
          }
        ];
      } else if (spell.type === "damageOverTime") {
        const durationMultiplier = inputs.curseMastery.checked ? 1.3 : 1;
        const totalDuration = spell.durationSeconds * durationMultiplier;
        const effectiveTicks = Math.max(0, totalDuration * (1 - debuffDurationReduction));
        const tickDamage = spell.damagePerSecond * getEffectiveMdrMultiplier();
        const totalDamage = tickDamage * effectiveTicks;

        results = [
          {
            name: `${spell.name} Damage Over Time`,
            bonus: 0,
            damage: totalDamage
          },
          {
            name: `${spell.name} Tick Damage`,
            bonus: 0,
            damage: tickDamage,
            tickOnly: true,
            effectiveTicks
          }
        ];
      } else if (spell.type === "formulaNeeded") {
        results = [
          {
            name: spell.name,
            bonus: 0,
            damage: 0,
            note: "Formula needed"
          }
        ];
      } else {
        results = [
          {
            name: spell.name,
            bonus: 0,
            damage: calculateDamage(spell, 0, { faithfulness: faithfulnessActive })
          }
        ];
      }

      damageList.innerHTML = results.map((result, index) => {
        const bonusText = result.bonus === 0
          ? "+0%"
          : `${result.bonus > 0 ? "+" : ""}${Math.round(result.bonus * 100)}%`;
        const hitLocationText = result.isProjectileResult
          ? `<span>Hit location bonus: ${bonusText}</span>`
          : "";
        const tickText = result.tickOnly
          ? `<span>Active ticks after debuff duration: ${floorToOneDecimal(result.effectiveTicks)}</span>`
          : "";
        const noteText = result.note
          ? `<span>${result.note}</span>`
          : "";
        const damageText = result.tickOnly
          ? floorToTwoDecimals(result.damage)
          : floorToOneDecimal(result.damage);

        return `
          <div class="damage-row ${index === 0 ? "primary" : ""}">
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

      if (spell.type === "fireball") {
        const directTotal = results.find((result) => result.kind === "directTotal")?.damage || 0;
        selectedLabel.textContent = "Direct Hit + Burn Damage";
        mainTotal.textContent = floorToOneDecimal(directTotal);
        updateHpBar();
        return;
      }

      if (
        spell.dot
        || spell.type === "damageOverTime"
        || spell.type === "healingOverTime"
        || spell.type === "instantHealing"
        || spell.type === "clericHealingOverTime"
        || spell.type === "clericDamageOverTime"
      ) {
        const combinedDamage = results.reduce((total, result) => {
          if (result.tickOnly) {
            return total;
          }

          return total + result.damage;
        }, 0);
        if (
          spell.type === "healingOverTime"
          || spell.type === "instantHealing"
          || spell.type === "clericHealingOverTime"
        ) {
          selectedLabel.textContent = "Total Healing";
        } else {
          selectedLabel.textContent = spell.dot && inputs.characterClass.value === "wizard"
            ? "Initial Hit + Burn Damage"
            : spell.dot ? "Initial Hit + Damage Over Time" : "Total Damage Over Time";
        }

        mainTotal.textContent = floorToOneDecimal(combinedDamage);
        updateHpBar();
        return;
      }

      const selectedResult = results.find((result) => result.name === "Body") || results[0];
      selectedLabel.textContent = spell.isProjectile ? "Selected Result: Body" : "Selected Result";
      mainTotal.textContent = floorToOneDecimal(selectedResult.damage);
      updateHpBar();
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

    openHpView.addEventListener("click", showHpView);
    showDamageDealt.addEventListener("click", applyHpDamage);
    backToCalculator.addEventListener("click", showCalculatorView);
    targetHp.addEventListener("input", resetHpSimulation);
    targetHp.addEventListener("change", resetHpSimulation);

    applyDefaultValues();
    updateSpellOptions();
    renderResults();
