// Données factices pour simuler la base de données
let users = [{ id: 1, username: 'testuser', email: 'test@example.com', password: 'password123' }]

let tasks = [
  { id: 1, userId: 1, title: 'Apprendre Vuex', completed: false },
  { id: 2, userId: 1, title: 'Créer un mock API', completed: true },
  { id: 3, userId: 1, title: 'Finaliser le design CSS', completed: false },
]

let nextTaskId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
let nextUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

// --- Fonctions simulant les appels API ---

// Simule un délai réseau
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Simule une connexion réussie
export async function mockLogin(email, password) {
  await simulateDelay()
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    // Simule un token JWT
    const token = `mock_jwt_for_${user.username}_${Date.now()}`
    return {
      status: 200,
      data: {
        token: token,
        user: { id: user.id, username: user.username, email: user.email },
      },
    }
  } else {
    throw {
      response: {
        status: 401,
        data: { message: 'Identifiants incorrects' },
      },
    }
  }
}

// Simule une inscription
export async function mockRegister(username, email, password) {
  await simulateDelay()
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    throw {
      response: {
        status: 409, // Conflict
        data: { message: 'Cet email est déjà enregistré.' },
      },
    }
  } else {
    const newUser = { id: nextUserId++, username, email, password }
    users.push(newUser)
    return {
      status: 201,
      data: { message: 'Inscription réussie!' },
    }
  }
}

// Simule la récupération de l'utilisateur actuel
export async function mockFetchCurrentUser(token) {
  await simulateDelay()
  // Ici, on "décode" le mock token pour trouver l'utilisateur
  const usernameFromToken = token.split('_')[3] // Récupère le username du token factice
  const user = users.find((u) => u.username === usernameFromToken)

  if (user) {
    return {
      status: 200,
      data: { user: { id: user.id, username: user.username, email: user.email } },
    }
  } else {
    throw {
      response: {
        status: 401, // Unauthorized
        data: { message: 'Token invalide ou expiré' },
      },
    }
  }
}

// Simule la récupération des tâches pour un utilisateur donné
export async function mockFetchTasks(userId) {
  await simulateDelay()
  // Dans un vrai scénario, filtrerait par userId. Ici, on retourne toutes les tâches pour la démo.
  // Pour une démo simple avec un seul utilisateur, on retourne toutes les tâches existantes.
  const userTasks = tasks.filter((task) => task.userId === userId)
  return {
    status: 200,
    data: userTasks,
  }
}

// Simule l'ajout d'une tâche
export async function mockAddTask(title, userId) {
  await simulateDelay()
  const newTask = { id: nextTaskId++, userId, title, completed: false }
  tasks.push(newTask)
  return {
    status: 201,
    data: newTask,
  }
}

// Simule la mise à jour d'une tâche
export async function mockToggleTaskCompletion(taskId, completedStatus, userId) {
  await simulateDelay()
  const taskIndex = tasks.findIndex((t) => t.id === taskId && t.userId === userId) // Vérifier aussi l'ID utilisateur
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = completedStatus
    return {
      status: 200,
      data: tasks[taskIndex],
    }
  } else {
    throw {
      response: {
        status: 404,
        data: { message: 'Tâche non trouvée ou non autorisée' },
      },
    }
  }
}

// Simule la suppression d'une tâche
export async function mockDeleteTask(taskId, userId) {
  await simulateDelay()
  const initialLength = tasks.length
  tasks = tasks.filter((t) => t.id !== taskId || t.userId !== userId) // Filtrer par taskId ET userId
  if (tasks.length < initialLength) {
    return { status: 204 } // No Content for successful deletion
  } else {
    throw {
      response: {
        status: 404,
        data: { message: 'Tâche non trouvée ou non autorisée' },
      },
    }
  }
}
