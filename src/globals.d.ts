interface Window {
  app: any;  // Replace 'any' with a more specific type if known
}

declare function loadImJoyCore(): Promise<any>;
declare function loadImJoyRPC(): Promise<any>;
