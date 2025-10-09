type BudgetEventType = 'budget-created' | 'budget-updated' | 'budget-deleted'
type BudgetEventCallback = () => void

class BudgetEventEmitter {
    private listeners: Map<BudgetEventType, Set<BudgetEventCallback>> = new Map()

    subscribe(event: BudgetEventType, callback: BudgetEventCallback): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        
        this.listeners.get(event)!.add(callback)
        
        // Return función de desuscripción
        return () => {
            this.listeners.get(event)?.delete(callback)
        }
    }

    emit(event: BudgetEventType): void {
        const callbacks = this.listeners.get(event)
        if (callbacks) {
            callbacks.forEach(callback => callback())
        }
    }
}

export const budgetEvents = new BudgetEventEmitter()