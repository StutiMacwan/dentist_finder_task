## 🗕️ Appointment Slot API

This project implements an internal API to fetch normalized appointment slots from a mock external API, with support for pagination, filtering, API key authentication, and error handling.

---

### 🚀 Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create Environment File**
   Create a `.env` file in the root directory and add:

   ```env
   MOCK_API_BASE_URL=http://localhost:4000
   PORT=4000
   API_KEY=STUTI
   ```

4. **Run the Server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`.

---

### 🧠 Project Overview & Assumptions

* The internal API fetches slot data from a **mock external API** and normalizes the structure.
* The API supports:

  * **Pagination** via `page` and `per_page` query parameters.
  * **Filtering** by `provider` and `date`.
  * **API key authentication** for both internal and mock routes using `x-api-key` header.
* Assumes external slot formats may differ and handles two structures via `normalizeSlots`.

---

### 📁 API Structure

#### 🔧 Middleware

* `middleware/apiKeyAuth.ts`
  Validates `x-api-key` header for secure access to `/api/*` and `/mock-external-api/*` routes.

---

#### 🌐 Mock External API

* **Route**: `/mock-external-api/slots`
* **File**: `mockApi.ts`
* **Purpose**: Simulates 3rd-party data sources with varying structures:

  * Format 1: Date-based times and doctor
  * Format 2: Slot ranges and provider
* Requires API key via `x-api-key` header.

---

#### 🔍 Internal API

* **Route**: `/api/available-slots`
* **File**: `routes.ts`
* **Features**:

  * Fetches and normalizes data from external mock API
  * Supports query parameters:

    * `provider` (optional)
    * `date` (optional, format: `YYYY-MM-DD`)
    * `page` (default: 1)
    * `per_page` (default: 10)
  * Responds with:

    ```json
    {
      "total": 12,
      "page": 1,
      "per_page": 10,
      "data": [...]
    }
    ```

---

### 🔐 Authentication

All API requests must include the following header:

```http
x-api-key: STUTI
```

If the key is missing or incorrect, the API will return:

```json
{ "error": "Unauthorized" }
```

---

### ✅ Example Usage

#### Request:

```http
GET /api/available-slots?page=2&provider=Dr.%20Smith&date=2025-07-20
x-api-key: STUTI
```

#### Response:

```json
{
  "total": 12,
  "page": 2,
  "per_page": 10,
  "data": [ ... ]
}
```

---

### 🚰 Scripts

* `npm run dev`: Start server with `ts-node-dev`
* `npm start`: Run compiled JS
* `npm run build`: Compile TypeScript to JavaScript
