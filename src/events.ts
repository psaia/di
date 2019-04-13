import { PubSubEvent } from "./types";

export default class Events {
  events: PubSubEvent[] = [];
  fastEvents: any = {};
  publish(name: string, payload: any) {
    const evts = this.events;
    for (let i = 0, l = evts.length; i < l; i++) {
      if (name === evts[i].name) {
        this.events[i].fn(payload);
      }
    }
  }
  subscribe(name: string, fn: (any) => any) {
    this.events.push({ name, fn });
  }
  /**
   * O(1) publishing.
   */
  publishFast(name, payload) {
    const fn = this.fastEvents[name];
    if (fn) {
      fn(payload);
    }
  }
  /**
   * O(1) subscribing.
   */
  subscribeFast(name: string, fn: (any) => any) {
    this.fastEvents[name] = fn;
  }
}
