import { Constants } from "./contants";

/**
 * Get the default options.
 */
function getDefaults(): D20Options {
  return  {
    maxRolls: 100,
    maxDice: 20
  };
}

export default class D20 {
  private options: D20Options;

  constructor(options: D20Options = {}) {
    this.options = Object.assign(getDefaults(), options);
  }

  /**
   * Role a dice.
   */
  roll(dice: Dice, verbose: boolean = false): number[] | number {
    const result = this.doRoll(dice);
    if (verbose) {
      return result;
    }
    let num: number = 0;

    result.forEach((value, key) => {
      num += result[key];
    });

    return num;
  }

  /**
   * Process the dice rolls.
   */
  private doRoll(dice: Dice) {
    let amount: number = 1;
    let modifier: number = 0;
    let results: number[] = [];

    if (!dice) {
      throw new Error("Dice parameter missing.");
    }

    if (typeof dice === "string") {
      const handler = this.handleString(dice);
      amount = handler.amount;
      modifier = handler.modifier;
      dice = handler.dice;
    }

    for (let i = 0; i < amount; i++) {
      let num: number = null;
      if (dice !== 0) {
        num = Math.floor(Math.random() * (dice as number) + 1);
      } else {
        num = 0;
      }
      results.push(num);
    }

    results = results.sort((a, b) => {
      return a - b;
    });

    if (modifier != 0) {
      results.push(modifier);
    }
    return results;
  }

  /**
   * Handles a dice roll which was passed as a string.
   */
  private handleString(dice: string | number) {
    let amount: number = 0;
    let modifier: number = 0;

    const match = (dice as string).match(Constants.match);
    // Check for invalid sizes on the rolls or the dice based on the settings.
    if (parseInt(match[1]) > this.options.maxRolls) {
      throw new Error(`Invalid throw count. Max: ${this.options.maxRolls}`);
    }
    if (parseInt(match[2]) > this.options.maxDice) {
      throw new Error(`Invalid dice size. Max: ${this.options.maxDice}`);
    }
    if (match) {
      if (match[1]) {
        amount = parseInt(match[1]);
      }
      if (match[2]) {
        dice = parseInt(match[2]);
      }
      if (match[3]) {
        const modifiers = match[3].match(Constants.modifiers);
        if (modifiers) {
          for (let i = 0, length = modifiers.length; i < length; i++) {
            modifier += parseInt(modifiers[i].replace(/\s/g, ''));
          }
        }
      }
    }

    return {
      amount,
      modifier,
      dice
    }
  }
}

export type Dice = string | number;

export interface D20Options {
  maxRolls?: number;
  maxDice?: number;
}
