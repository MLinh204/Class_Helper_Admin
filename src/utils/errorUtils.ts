export function isAxiosError(error: unknown): error is { response: { data: { message?: string } } } {
    return (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as any).response?.data === "object"
    );
  }
  