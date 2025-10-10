export interface Category {
  id: number
  name: string
  user_id: number
  transaction_count?: number
}

export interface CategoryCreate {
  name: string
}

export interface CategoryUpdate {
  name?: string
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getAuthHeaders() {
  const token = localStorage.getItem('fintrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
    console.error('API Error:', errorData);
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse<Category[]>(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async createCategory(categoryData: CategoryCreate): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      return await handleResponse<Category>(response);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async updateCategory(id: number, categoryData: CategoryUpdate): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      return await handleResponse<Category>(response);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoriesApi;