// Categories management utilities and API integration

export interface Category {
  id: number
  name: string
  user_id: number
  created_at: string
  updated_at: string
}

export interface CategoryCreate {
  name: string
  type: "income" | "expense"
}

// API Base URL
const API_BASE_URL = "http://localhost:8000"

function getAuthHeaders() {
  const token = localStorage.getItem('fintrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
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
      console.log("Categories response:", response);
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

  async updateCategory(id: number, categoryData: Partial<CategoryCreate>): Promise<Category> {
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

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoriesApi;