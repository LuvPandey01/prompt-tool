/**
 * Prompt Enhancer Module
 * Enhances prompts based on analysis results using template matching and NLP techniques
 */

class PromptEnhancer {
  constructor() {
    this.templates = {
      creative: {
        pattern: /write|create|generate|compose/i,
        structure: "Create a [LENGTH] [FORMAT] about [TOPIC]. [REQUIREMENTS]. [AUDIENCE]. [STYLE]."
      },
      analytical: {
        pattern: /analyze|examine|evaluate|assess|compare/i,
        structure: "Analyze [TOPIC] by [METHOD]. Provide: 1) [REQUIREMENT1], 2) [REQUIREMENT2], 3) [REQUIREMENT3]. [AUDIENCE]. [FORMAT]."
      },
      explanatory: {
        pattern: /explain|describe|define|clarify/i,
        structure: "Explain [TOPIC] to [AUDIENCE]. Cover: [KEYPOINTS]. Use [STYLE] and provide [EXAMPLES]. [LENGTH]."
      },
      instructional: {
        pattern: /how to|steps|guide|tutorial/i,
        structure: "Provide a step-by-step guide on [TOPIC]. Include: [REQUIREMENTS]. [AUDIENCE]. [FORMAT]."
      }
    };
    
    this.enhancements = {
      clarity: {
        addActionWords: ['Analyze', 'Explain', 'Create', 'Describe', 'Compare', 'Evaluate'],
        replaceVague: {
          'good': 'high-quality',
          'bad': 'poor-quality',
          'nice': 'well-designed',
          'great': 'excellent',
          'stuff': 'content',
          'things': 'elements',
          'something': 'a specific example'
        }
      },
      specificity: {
        formats: [
          'in 200-300 words',
          'as a bulleted list',
          'in table format',
          'as a structured report',
          'with numbered steps',
          'in paragraph form'
        ],
        quantifiers: [
          'exactly 3 examples',
          'at least 5 key points',
          'no more than 500 words',
          'between 3-5 paragraphs'
        ]
      },
      context: {
        audiences: [
          'for beginners with no prior knowledge',
          'for professionals in the field',
          'for high school students',
          'for a general audience',
          'for technical experts'
        ],
        purposes: [
          'for educational purposes',
          'for business presentation',
          'for academic research',
          'for practical application',
          'for decision-making'
        ]
      }
    };
  }

  enhance(prompt, analysis) {
    let enhancedPrompt = prompt;
    const suggestions = [];
    const appliedEnhancements = [];

    // Detect prompt category
    const category = this.detectCategory(prompt);
    
    // Apply clarity enhancements
    if (analysis && analysis.clarity < 15) {
      const clarityResult = this.enhanceClarity(enhancedPrompt);
      enhancedPrompt = clarityResult.prompt;
      appliedEnhancements.push(...clarityResult.enhancements);
    }

    // Apply specificity enhancements
    if (analysis && analysis.specificity < 15) {
      const specificityResult = this.enhanceSpecificity(enhancedPrompt);
      enhancedPrompt = specificityResult.prompt;
      appliedEnhancements.push(...specificityResult.enhancements);
    }

    // Apply context enhancements
    if (analysis && analysis.context < 15) {
      const contextResult = this.enhanceContext(enhancedPrompt);
      enhancedPrompt = contextResult.prompt;
      appliedEnhancements.push(...contextResult.enhancements);
    }

    // Apply structure enhancements
    if (analysis && analysis.structure < 15) {
      const structureResult = this.enhanceStructure(enhancedPrompt);
      enhancedPrompt = structureResult.prompt;
      appliedEnhancements.push(...structureResult.enhancements);
    }

    // Apply template if significant improvement is needed
    if (analysis && analysis.totalScore < 50 && category) {
      const templateResult = this.applyTemplate(enhancedPrompt, category);
      if (templateResult.improved) {
        enhancedPrompt = templateResult.prompt;
        appliedEnhancements.push('Applied structured template');
      }
    }

    return {
      original: prompt,
      enhanced: enhancedPrompt,
      category,
      improvements: appliedEnhancements,
      comparisonAnalysis: this.comparePrompts(prompt, enhancedPrompt)
    };
  }

  detectCategory(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const [category, template] of Object.entries(this.templates)) {
      if (template.pattern.test(prompt)) {
        return category;
      }
    }
    
    // Fallback detection based on keywords
    if (lowerPrompt.includes('write') || lowerPrompt.includes('create')) {
      return 'creative';
    } else if (lowerPrompt.includes('analyze') || lowerPrompt.includes('compare')) {
      return 'analytical';
    } else if (lowerPrompt.includes('explain') || lowerPrompt.includes('describe')) {
      return 'explanatory';
    } else if (lowerPrompt.includes('how') || lowerPrompt.includes('step')) {
      return 'instructional';
    }
    
    return 'general';
  }

  enhanceClarity(prompt) {
    let enhanced = prompt;
    const enhancements = [];
    
    // Add action word if missing
    const hasActionWord = this.templates.creative.pattern.test(prompt) ||
                         this.templates.analytical.pattern.test(prompt) ||
                         this.templates.explanatory.pattern.test(prompt) ||
                         this.templates.instructional.pattern.test(prompt);
    
    if (!hasActionWord) {
      const actionWord = this.enhancements.clarity.addActionWords[
        Math.floor(Math.random() * this.enhancements.clarity.addActionWords.length)
      ];
      enhanced = `${actionWord} ${enhanced.toLowerCase()}`;
      enhancements.push('Added clear action word');
    }

    // Replace vague words
    const vageReplacements = this.enhancements.clarity.replaceVague;
    for (const [vague, specific] of Object.entries(vageReplacements)) {
      const regex = new RegExp(`\\b${vague}\\b`, 'gi');
      if (regex.test(enhanced)) {
        enhanced = enhanced.replace(regex, specific);
        enhancements.push(`Replaced vague term "${vague}" with "${specific}"`);
      }
    }

    return { prompt: enhanced, enhancements };
  }

  enhanceSpecificity(prompt) {
    let enhanced = prompt;
    const enhancements = [];

    // Add format specification if missing
    const hasFormat = /format|length|words|style|structure/i.test(prompt);
    if (!hasFormat) {
      const format = this.enhancements.specificity.formats[
        Math.floor(Math.random() * this.enhancements.specificity.formats.length)
      ];
      enhanced += ` Present the response ${format}.`;
      enhancements.push(`Added format specification: "${format}"`);
    }

    // Add quantifier if missing numbers
    const hasNumbers = /\d+/.test(prompt);
    if (!hasNumbers) {
      const quantifier = this.enhancements.specificity.quantifiers[
        Math.floor(Math.random() * this.enhancements.specificity.quantifiers.length)
      ];
      enhanced += ` Include ${quantifier}.`;
      enhancements.push(`Added quantifier: "${quantifier}"`);
    }

    return { prompt: enhanced, enhancements };
  }

  enhanceContext(prompt) {
    let enhanced = prompt;
    const enhancements = [];

    // Add audience if missing
    const hasAudience = /audience|for|student|beginner|expert|professional/i.test(prompt);
    if (!hasAudience) {
      const audience = this.enhancements.context.audiences[
        Math.floor(Math.random() * this.enhancements.context.audiences.length)
      ];
      enhanced += ` Write this ${audience}.`;
      enhancements.push(`Added audience context: "${audience}"`);
    }

    // Add purpose if missing
    const hasPurpose = /purpose|goal|because|for.*purpose/i.test(prompt);
    if (!hasPurpose) {
      const purpose = this.enhancements.context.purposes[
        Math.floor(Math.random() * this.enhancements.context.purposes.length)
      ];
      enhanced += ` This content is intended ${purpose}.`;
      enhancements.push(`Added purpose: "${purpose}"`);
    }

    return { prompt: enhanced, enhancements };
  }

  enhanceStructure(prompt) {
    let enhanced = prompt;
    const enhancements = [];

    // Break into sentences if it's one long sentence
    const sentences = prompt.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length === 1 && prompt.length > 100) {
      // Try to break it into logical parts
      const parts = this.breakIntoLogicalParts(prompt);
      if (parts.length > 1) {
        enhanced = parts.join('. ') + '.';
        enhancements.push('Broke long sentence into structured parts');
      }
    }

    // Add structure if missing
    const hasStructure = /first|then|next|finally|1\.|2\.|3\.|•|-/i.test(prompt);
    if (!hasStructure && enhanced.length > 50) {
      enhanced += ' Please organize your response with: 1) Main points, 2) Supporting details, and 3) Conclusion.';
      enhancements.push('Added structural organization');
    }

    return { prompt: enhanced, enhancements };
  }

  breakIntoLogicalParts(prompt) {
    // Simple heuristic to break long prompts into logical parts
    const conjunctions = ['and', 'but', 'or', 'also', 'additionally', 'furthermore'];
    let parts = [prompt];
    
    for (const conjunction of conjunctions) {
      const newParts = [];
      for (const part of parts) {
        const splitParts = part.split(new RegExp(`\\s+${conjunction}\\s+`, 'i'));
        if (splitParts.length > 1) {
          newParts.push(...splitParts);
        } else {
          newParts.push(part);
        }
      }
      parts = newParts;
    }
    
    return parts.filter(p => p.trim().length > 10);
  }

  applyTemplate(prompt, category) {
    if (!this.templates[category]) {
      return { improved: false, prompt };
    }

    const template = this.templates[category];
    // This is a simplified template application
    // In a more sophisticated version, this would extract entities and fill template slots
    
    return { improved: false, prompt }; // Simplified for now
  }

  comparePrompts(original, enhanced) {
    const originalWords = original.split(/\s+/).length;
    const enhancedWords = enhanced.split(/\s+/).length;
    
    return {
      originalLength: originalWords,
      enhancedLength: enhancedWords,
      lengthIncrease: enhancedWords - originalWords,
      improvementRatio: enhancedWords / originalWords
    };
  }
}

module.exports = new PromptEnhancer();