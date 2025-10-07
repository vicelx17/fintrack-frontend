type TransactionEventType = 'transaction-created' | 'transaction-updated' | 'transaction-deleted';

type TransactionEventListener = () => void;

class TransactionEventManager {
  private listeners: Map<TransactionEventType, Set<TransactionEventListener>> = new Map();

  subscribe(event: TransactionEventType, callback: TransactionEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: TransactionEventType) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }

  // Emitir cualquier cambio en transacciones
  emitChange() {
    this.emit('transaction-created');
    this.emit('transaction-updated');
    this.emit('transaction-deleted');
  }
}

export const transactionEvents = new TransactionEventManager();