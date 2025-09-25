export interface SimulatedPurchase {
  courseId: number;
  studentName: string;
  location: string;
  purchaseAmount: number;
}

export class PurchaseSimulator {
  private static instance: PurchaseSimulator;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Sample data for realistic simulation
  private readonly sampleNames = [
    'Sarah M.', 'James K.', 'Emily R.', 'David L.', 'Lisa P.', 'Michael S.',
    'Anna T.', 'Chris W.', 'Jessica H.', 'Daniel B.', 'Sophie C.', 'Ryan F.',
    'Maria G.', 'Alex J.', 'Katie N.', 'Tom V.', 'Emma D.', 'Luke H.',
    'Grace L.', 'Ben M.', 'Chloe R.', 'Jack S.', 'Mia T.', 'Noah W.',
    'Oliver P.', 'Charlotte F.', 'Harry S.', 'Amelia B.', 'George C.', 'Isla M.'
  ];

  private readonly sampleLocations = [
    'City Centre', 'North Region', 'Central Region', 'North East', 'West Region',
    'Central North', 'South West', 'East Midlands', 'North East', 'West Region',
    'Central Scotland', 'Northern Scotland', 'Northern Ireland', 'South Coast', 'South East',
    'East Region', 'West Midlands', 'Yorkshire', 'Central England', 'West Central'
  ];

  // Course ID to price mapping (you can adjust these based on your actual courses)
  private readonly coursePricing: Record<number, { basePrice: number; title: string }> = {
    1: { basePrice: 299, title: 'Complete Beginner Course' },
    2: { basePrice: 399, title: 'Advanced Driving Skills' },
    3: { basePrice: 599, title: 'Intensive Weekly Course' },
    4: { basePrice: 349, title: 'Weekend Driving Course' },
    5: { basePrice: 329, title: 'Automatic Transmission' },
  };

  public static getInstance(): PurchaseSimulator {
    if (!PurchaseSimulator.instance) {
      PurchaseSimulator.instance = new PurchaseSimulator();
    }
    return PurchaseSimulator.instance;
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateRandomPurchase(): SimulatedPurchase {
    const courseIds = Object.keys(this.coursePricing).map(Number);
    const courseId = this.getRandomElement(courseIds);
    const courseInfo = this.coursePricing[courseId];
    
    // Add some price variation (±10%)
    const priceVariation = (Math.random() - 0.5) * 0.2; // -10% to +10%
    const purchaseAmount = Math.round(courseInfo.basePrice * (1 + priceVariation));
    
    return {
      courseId,
      studentName: this.getRandomElement(this.sampleNames),
      location: this.getRandomElement(this.sampleLocations),
      purchaseAmount,
    };
  }

  private getRandomInterval(): number {
    // Generate realistic intervals:
    // - 70% chance: 2-8 minutes (high activity periods)
    // - 20% chance: 8-20 minutes (medium activity)
    // - 10% chance: 20-60 minutes (low activity periods)
    
    const rand = Math.random();
    
    if (rand < 0.7) {
      // High activity: 2-8 minutes
      return (2 + Math.random() * 6) * 60 * 1000;
    } else if (rand < 0.9) {
      // Medium activity: 8-20 minutes  
      return (8 + Math.random() * 12) * 60 * 1000;
    } else {
      // Low activity: 20-60 minutes
      return (20 + Math.random() * 40) * 60 * 1000;
    }
  }

  private async simulatePurchase(): Promise<void> {
    try {
      const purchase = this.generateRandomPurchase();
      
      // Call the API to record the simulated purchase
      const response = await fetch('/api/stats/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...purchase,
          isRealPurchase: false, // Mark as simulated
        }),
      });

      if (!response.ok) {
        console.warn('Failed to record simulated purchase:', response.statusText);
      }
    } catch (error) {
      console.error('Error simulating purchase:', error);
    }
  }

  private scheduleNextPurchase(): void {
    if (!this.isRunning) return;

    const interval = this.getRandomInterval();
    
    this.intervalId = setTimeout(() => {
      this.simulatePurchase().then(() => {
        this.scheduleNextPurchase(); // Schedule the next one
      });
    }, interval);
  }

  public start(): void {
    if (this.isRunning) {
      console.log('Purchase simulator is already running');
      return;
    }

    console.log('Starting purchase simulator...');
    this.isRunning = true;
    
    // Start with a small initial delay (30 seconds to 2 minutes)
    const initialDelay = 30000 + Math.random() * 90000;
    
    setTimeout(() => {
      this.scheduleNextPurchase();
    }, initialDelay);
  }

  public stop(): void {
    if (!this.isRunning) {
      console.log('Purchase simulator is not running');
      return;
    }

    console.log('Stopping purchase simulator...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  // Method to manually trigger a purchase (for testing)
  public async triggerPurchase(): Promise<void> {
    await this.simulatePurchase();
  }
}

// Export a singleton instance
export const purchaseSimulator = PurchaseSimulator.getInstance();