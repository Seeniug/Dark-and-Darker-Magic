const classSpells = {
      warlock: [
        {
          id: "curse",
          name: "Curse Of Pain",
          label: "Curse Of Pain",
          baseDamage: 15,
          scaling: 1,
          isProjectile: false,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "projectileReduction",
            "penetration",
            "debuffDuration",
            "curseMastery",
            "cow"
          ],
          dot: {
            name: "Curse of Pain Damage Over Time",
            baseDamage: 15,
            scaling: 0.5,
            isProjectile: false,
            durationSeconds: 8
          }
        },
        {
          id: "bolt",
          name: "Bolt of Darkness",
          label: "Bolt of Darkness",
          baseDamage: 20,
          scaling: 1,
          isProjectile: true,
          darkEnhancement: true,
          soulCollector: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "projectileReduction",
            "penetration",
            "cow",
            "darkEnhancement",
            "soulCollector"
          ]
        },
        {
          id: "blowOfCorruption",
          name: "Blow Of Corruption",
          label: "Blow Of Corruption",
          baseDamage: 12,
          scaling: 1,
          isProjectile: false,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "cow"
          ]
        },
        {
          id: "tortureMasteryHealing",
          name: "Torture Mastery Healing",
          label: "Torture Mastery Healing",
          type: "healingOverTime",
          durationSeconds: 8,
          visibleInputs: [
            "magicPower",
            "magicalHealing",
            "debuffDuration",
            "tortureMasterySource",
            "curseMastery",
            "vampirism"
          ]
        },
        {
          id: "powerOfSacrifice",
          name: "Power Of Sacrifice",
          label: "Power Of Sacrifice",
          type: "damageOverTime",
          damagePerSecond: 3,
          durationSeconds: 12,
          isProjectile: false,
          noScaling: true,
          visibleInputs: [
            "mdr",
            "penetration",
            "debuffDuration",
            "curseMastery",
            "cow"
          ]
        }
      ],
      wizard: [
        {
          id: "iceBolt",
          name: "Ice Bolt",
          label: "Ice Bolt",
          baseDamage: 30,
          scaling: 1,
          isProjectile: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "projectileReduction",
            "penetration"
          ]
        },
        {
          id: "magicMissile",
          name: "Magic Missile",
          label: "Magic Missile",
          type: "magicMissile",
          baseDamage: 10,
          scaling: 0.5,
          isProjectile: true,
          missileCount: 10,
          arcaneMastery: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "projectileReduction",
            "penetration",
            "arcaneMastery"
          ]
        },
        {
          id: "lightningStrike",
          name: "Lightning Strike",
          label: "Lightning Strike",
          baseDamage: 30,
          scaling: 1,
          isProjectile: false,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration"
          ]
        },
        {
          id: "chainLightning",
          name: "Chain Lightning",
          label: "Chain Lightning",
          type: "chainLightning",
          scaling: 1,
          isProjectile: false,
          hits: [
            { name: "First Target", baseDamage: 30 },
            { name: "Second Target", baseDamage: 25 },
            { name: "Third Target", baseDamage: 25 },
            { name: "Last Target", baseDamage: 20 }
          ],
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration"
          ]
        },
        {
          id: "zap",
          name: "Zap",
          label: "Zap",
          baseDamage: 20,
          scaling: 1,
          isProjectile: false,
          fireMastery: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "debuffDuration",
            "fireMastery"
          ],
          dot: {
            name: "Zap Damage Over Time",
            baseDamage: 1,
            fireMasteryBaseBonus: 2,
            scaling: 0.5,
            isProjectile: false,
            durationSeconds: 1,
            perSecond: true
          }
        },
        {
          id: "ignite",
          name: "Ignite",
          label: "Ignite",
          type: "ignite",
          fireMastery: true,
          initial: {
            name: "Initial Hit",
            baseDamage: 5,
            scaling: 0.5,
            isProjectile: false
          },
          dot: {
            name: "Burn Damage",
            baseDamage: 1,
            fireMasteryBaseBonus: 2,
            scaling: 0.5,
            isProjectile: false,
            durationSeconds: 1,
            perSecond: true
          },
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "debuffDuration",
            "fireMastery"
          ]
        },
        {
          id: "fireball",
          name: "Fireball",
          label: "Fireball",
          type: "fireball",
          fireMastery: true,
          direct: {
            name: "Direct Hit",
            baseDamage: 35,
            scaling: 1,
            isProjectile: true
          },
          splash: {
            name: "Splash Damage",
            baseDamage: 10,
            scaling: 1,
            isProjectile: false
          },
          dot: {
            name: "Total Burn Damage",
            baseDamage: 3,
            fireMasteryBaseBonus: 2,
            scaling: 0.5,
            isProjectile: false,
            durationSeconds: 2,
            perSecond: true
          },
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "projectileReduction",
            "penetration",
            "debuffDuration",
            "fireMastery"
          ]
        },
        {
          id: "explosion",
          name: "Explosion",
          label: "Explosion",
          baseDamage: 25,
          scaling: 1,
          isProjectile: false,
          fireMastery: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "debuffDuration",
            "fireMastery"
          ],
          dot: {
            name: "Explosion Damage Over Time",
            baseDamage: 3,
            fireMasteryBaseBonus: 1,
            scaling: 0.5,
            isProjectile: false,
            durationSeconds: 2,
            perSecond: true
          }
        }
      ],
      cleric: [
        {
          id: "holyStrike",
          name: "Holy Strike",
          label: "Holy Strike",
          baseDamage: 20,
          scaling: 1,
          isProjectile: false,
          faithfulness: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "faithfulness"
          ]
        },
        {
          id: "judgement",
          name: "Judgement",
          label: "Judgement",
          baseDamage: 25,
          scaling: 1,
          isProjectile: false,
          faithfulness: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "faithfulness"
          ]
        },
        {
          id: "smite",
          name: "Smite",
          label: "Smite",
          baseDamage: 10,
          scaling: 1,
          isProjectile: false,
          faithfulness: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "faithfulness"
          ]
        },
        {
          id: "lesserHeal",
          name: "Lesser Heal",
          label: "Lesser Heal",
          type: "instantHealing",
          baseHealing: 20,
          scaling: 0.8,
          visibleInputs: [
            "magicPower",
            "magicalHealing"
          ]
        },
        {
          id: "holyLight",
          name: "Holy Light",
          label: "Holy Light",
          type: "instantHealing",
          baseHealing: 35,
          scaling: 0.8,
          visibleInputs: [
            "magicPower",
            "magicalHealing"
          ]
        },
        {
          id: "sanctuary",
          name: "Sanctuary",
          label: "Sanctuary",
          type: "clericHealingOverTime",
          baseHealing: 5,
          scaling: 0.5,
          durationSeconds: 5,
          visibleInputs: [
            "magicPower",
            "magicalHealing"
          ]
        },
        {
          id: "locustSwarm",
          name: "Locust Swarm",
          label: "Locust Swarm",
          type: "clericDamageOverTime",
          baseDamage: 13,
          scaling: 1,
          faithfulness: true,
          durationSeconds: 6,
          tickInterval: 0.1,
          ignoresDebuffDuration: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration",
            "faithfulness"
          ]
        },
        {
          id: "earthquake",
          name: "Earthquake",
          label: "Earthquake",
          type: "clericDamageOverTime",
          baseDamage: 7,
          scaling: 0.5,
          durationSeconds: 6,
          tickInterval: 1,
          ignoresDebuffDuration: true,
          visibleInputs: [
            "weaponDamage",
            "magicPower",
            "additionalDamage",
            "mdr",
            "penetration"
          ]
        }
      ]
    };

    const hitLocations = [
      { name: "Head", bonus: 0.5 },
      { name: "Body", bonus: 0 },
      { name: "Arms", bonus: -0.2 },
      { name: "Legs", bonus: -0.4 },
      { name: "Hands/Feet", bonus: -0.5 }
    ];
