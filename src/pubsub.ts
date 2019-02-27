interface Event {
  name: string;
  group: string;
  fn: (any) => any;
}

export default class Pubsub {
  protected events: Event[] = [];

  public publish(name: string, payload: any) {
    const evts = this.events;
    for (let i = 0, l = evts.length; i < l; i++) {
      if (name === evts[i].name) {
        evts[i].fn(payload);
      }
    }
  }

  public subscribe(name: string, fn: (any) => any, group: string = "global") {
    this.events.push({ name, fn, group });
  }
}
