/**
 * Prompt Analyzer Module
 * Analyzes prompts across four key dimensions: clarity, specificity, context, and structure
 */

class PromptAnalyzer {
  constructor() {
    this.actionWords = [
      'analyze', 'explain', 'create', 'write', 'generate', 'describe', 'compare',
      'summarize', 'evaluate', 'design', 'develop', 'build', 'implement',
      'calculate', 'solve', 'identify', 'list', 'outline', 'define', 'classify'
    ];
    
    this.vageWords = [
      'good', 'bad', 'nice', 'great', 'awesome', 'terrible', 'amazing',
      'fine', 'okay', 'decent', 'pretty', 'quite', 'very', 'really',
      'something', 'anything', 'stuff', 'things', 'some', 'maybe'
    ];
    
    this.contextIndicators = [
      'for', 'audience', 'target', 'purpose', 'goal', 'background', 'context',
      'situation', 'scenario', 'use case', 'intended', 'aimed at', 'designed for'
    ];
    
    this.formatIndicators = [
      'format', 'structure', 'style', 'length', 'words', 'paragraphs',
      'list', 'bullet', 'numbered', 'table', 'report', 'essay', 'summary'
    ];
  }

  analyze(prompt) {
    const words = this.tokenize(prompt);
    const sentences = this.splitSentences(prompt);
    
    const clarityScore = this.analyzeClarety(prompt, words);
    const specificityScore = this.analyzeSpecificity(prompt, words);
    const contextScore = this.analyzeContext(prompt, words);
    const structureScore = this.analyzeStructure(prompt, sentences);
    
    const totalScore = clarityScore + specificityScore + contextScore + structureScore;
    const suggestions = this.generateSuggestions(prompt, words, {
      clarity: clarityScore,
      specificity: specificityScore,
      context: contextScore,
      structure: structureScore
    });
    
    return {
      totalScore,
      maxScore: 100,
      percentage: Math.round((totalScore / 100) * 100),
      scores: {
        clarity: clarityScore,
        specificity: specificityScore,
        context: contextScore,
        structure: structureScore
      },
      breakdown: {
        clarity: {
          score: clarityScore,
          maxScore: 25,
          description: 'Measures the presence of clear action words and absence of vague terms'
        },
        specificity: {
          score: specificityScore,
          maxScore: 25,
          description: 'Evaluates concrete details, format specifications, and measurable requirements'
        },
        context: {
          score: contextScore,
          maxScore: 25,
          description: 'Assesses background information, audience definition, and situational context'
        },
        structure: {
          score: structureScore,
          maxScore: 25,
          description: 'Examines prompt organization, logical flow, and formatting'
        }
      },
      suggestions,
      analysis: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        hasActionWords: this.hasActionWords(words),
        hasVagueWords: this.hasVagueWords(words),
        hasContext: this.hasContextIndicators(words),
        hasFormat: this.hasFormatIndicators(words)
      }
    };
  }

  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  splitSentences(text) {
    return text.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  analyzeClarety(prompt, words) {
    let score = 0;
    
    // Check for action words (up to 15 points)
    const actionWordCount = words.filter(word => 
      this.actionWords.includes(word)
    ).length;
    score += Math.min(actionWordCount * 5, 15);
    
    // Deduct for vague words (up to -10 points)
    const vague WordCount = words.filter(word => 
      this.vageWords.includes(word)
    ).length;
    score -= Math.min(vague WordCount * 2, 10);
    
    // Bonus for specific verbs and clear instructions (up to 10 points)
    if (prompt.length > 10 && actionWordCount > 0) {
      score += 5;
    }
    
    if (words.length > 5 && vague WordCount === 0) {
      score += 5;
    }
    
    return Math.max(0, Math.min(score, 25));
  }

  analyzeSpecificity(prompt, words) {
    let score = 0;
    
    // Check for numbers and quantifiable terms (up to 10 points)
    const hasNumbers = /\d+/.test(prompt);
    if (hasNumbers) score += 5;
    
    const quantifiers = ['how many', 'how much', 'specific', 'exactly', 'precisely'];
    const hasQuantifiers = quantifiers.some(q => prompt.toLowerCase().includes(q));
    if (hasQuantifiers) score += 5;
    
    // Check for format specifications (up to 10 points)
    const formatCount = words.filter(word => 
      this.formatIndicators.includes(word)
    ).length;
    score += Math.min(formatCount * 3, 10);
    
    // Check for detailed requirements (up to 5 points)
    const detailWords = ['include', 'must', 'should', 'need', 'require', 'ensure'];
    const hasDetails = detailWords.some(word => prompt.toLowerCase().includes(word));
    if (hasDetails) score += 5;
    
    return Math.min(score, 25);
  }

  analyzeContext(prompt, words) {
    let score = 0;
    
    // Check for audience specification (up to 10 points)
    const audienceWords = ['audience', 'for', 'student', 'beginner', 'expert', 'professional'];
    const hasAudience = audienceWords.some(word => prompt.toLowerCase().includes(word));
    if (hasAudience) score += 10;
    
    // Check for purpose/goal (up to 10 points)
    const purposeWords = ['purpose', 'goal', 'objective', 'aim', 'intend', 'because'];
    const hasPurpose = purposeWords.some(word => prompt.toLowerCase().includes(word));
    if (hasPurpose) score += 10;
    
    // Check for background context (up to 5 points)
    const contextCount = words.filter(word => 
      this.contextIndicators.includes(word)
    ).length;
    score += Math.min(contextCount * 2, 5);
    
    return Math.min(score, 25);
  }

  analyzeStructure(prompt, sentences) {
    let score = 0;
    
    // Check for organized structure (up to 15 points)
    const hasLists = /[0-9]+\.|\*|\-/.test(prompt);
    if (hasLists) score += 8;
    
    const hasMultipleSentences = sentences.length > 1;
    if (hasMultipleSentences) score += 7;
    
    // Check for logical flow (up to 10 points)
    const transitionWords = ['first', 'then', 'next', 'finally', 'also', 'additionally'];
    const hasTransitions = transitionWords.some(word => prompt.toLowerCase().includes(word));
    if (hasTransitions) score += 5;
    
    const hasQuestions = prompt.includes('?');
    if (hasQuestions) score += 5;
    
    return Math.min(score, 25);
  }

  hasActionWords(words) {
    return words.some(word => this.actionWords.includes(word));
  }

  hasVagueWords(words) {
    return words.some(word => this.vageWords.includes(word));
  }

  hasContextIndicators(words) {
    return words.some(word => this.contextIndicators.includes(word));
  }

  hasFormatIndicators(words) {
    return words.some(word => this.formatIndicators.includes(word));
  }

  generateSuggestions(prompt, words, scores) {
    const suggestions = [];
    
    if (scores.clarity < 15) {
      if (!this.hasActionWords(words)) {
        suggestions.push({
          type: 'clarity',
          message: 'Add a clear action word like "explain", "analyze", "create", or "describe"',
          priority: 'high'
        });
      }
      
      if (this.hasVagueWords(words)) {
        suggestions.push({
          type: 'clarity',
          message: 'Replace vague words like "good", "nice", or "something" with specific terms',
          priority: 'medium'
        });
      }
    }
    
    if (scores.specificity < 15) {
      if (!this.hasFormatIndicators(words)) {
        suggestions.push({
          type: 'specificity',
          message: 'Specify the desired output format (e.g., "in 200 words", "as a list", "in table format")',
          priority: 'high'
        });
      }
      
      if (!/\d+/.test(prompt)) {
        suggestions.push({
          type: 'specificity',
          message: 'Include specific numbers or quantities for better results',
          priority: 'medium'
        });
      }
    }
    
    if (scores.context < 15) {
      if (!this.hasContextIndicators(words)) {
        suggestions.push({
          type: 'context',
          message: 'Add context about your audience (e.g., "for beginners", "for professionals")',
          priority: 'high'
        });
      }
      
      suggestions.push({
        type: 'context',
        message: 'Explain the purpose or goal of your request',
        priority: 'medium'
      });
    }
    
    if (scores.structure < 15) {
      if (prompt.split('.').length === 1) {
        suggestions.push({
          type: 'structure',
          message: 'Break your prompt into multiple sentences for better clarity',
          priority: 'medium'
        });
      }
      
      suggestions.push({
        type: 'structure',
        message: 'Consider organizing your requirements in a numbered list',
        priority: 'low'
      });
    }
    
    return suggestions;
  }
}

module.exports = new PromptAnalyzer();