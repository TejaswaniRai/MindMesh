'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@/types"
import { Eye, EyeOff, Mail, Lock, User, Loader2, UserPlus } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    enrollmentNumber: '',
    batch: '',
    department: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    if (isRegisterMode) {
      if (!formData.name.trim()) {
        alert('Please enter your full name')
        return false
      }
      if (!formData.enrollmentNumber.trim()) {
        alert('Please enter your enrollment number')
        return false
      }
      if (role === 'student' && !formData.batch.trim()) {
        alert('Please enter your batch')
        return false
      }
      if (role !== 'student' && !formData.department.trim()) {
        alert('Please enter your department')
        return false
      }
      if (!formData.email.trim()) {
        alert('Please enter your email')
        return false
      }
      if (!formData.password.trim()) {
        alert('Please enter your password')
        return false
      }
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long')
        return false
      }
    } else {
      if (!formData.email.trim()) {
        alert('Please enter your email')
        return false
      }
      if (!formData.password.trim()) {
        alert('Please enter your password')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (isRegisterMode) {
      // Registration logic
      console.log('Registration data:', {
        name: formData.name,
        enrollmentNumber: formData.enrollmentNumber,
        batch: role === 'student' ? formData.batch : undefined,
        department: role !== 'student' ? formData.department : undefined,
        email: formData.email,
        password: formData.password,
        role
      })
      // In a real app, we would send this data to the server
      alert('Registration successful! Please wait for admin approval.')
      setIsRegisterMode(false)
    } else {
      // Login logic
      // In a real app, we would validate credentials here
      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/student')
      }
    }

    setIsLoading(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="space-y-4">
        {isRegisterMode && (
          <motion.div
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Label htmlFor="name" className="text-white/90 font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/50"
                placeholder="Enter your full name"
              />
            </div>
          </motion.div>
        )}

        {isRegisterMode && (
          <motion.div
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.5 }}
          >
            <Label htmlFor="enrollmentNumber" className="text-white/90 font-medium">
              Enrollment Number
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                id="enrollmentNumber"
                name="enrollmentNumber"
                type="text"
                required
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/50"
                placeholder="Enter your enrollment number"
              />
            </div>
          </motion.div>
        )}

        {isRegisterMode && role === 'student' && (
          <motion.div
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Label htmlFor="batch" className="text-white/90 font-medium">
              Batch
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                id="batch"
                name="batch"
                type="text"
                required
                value={formData.batch}
                onChange={handleInputChange}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/50"
                placeholder="Enter your batch (e.g., 2023-2027)"
              />
            </div>
          </motion.div>
        )}

        {isRegisterMode && role !== 'student' && (
          <motion.div
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Label htmlFor="department" className="text-white/90 font-medium">
              Department
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                id="department"
                name="department"
                type="text"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/50"
                placeholder="Enter your department"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          className="space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: isRegisterMode ? 1.05 : 0.9, duration: 0.5 }}
        >
          <Label htmlFor="email" className="text-white/90 font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/50"
              placeholder="Enter your email"
            />
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Label htmlFor="password" className="text-white/90 font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input 
              id="password" 
              name="password"
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/50"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <Label htmlFor="role" className="text-white/90 font-medium">
            Select Role
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 z-10" />
            <Select
              value={role}
              onValueChange={(value: UserRole) => setRole(value)}
            >
              <SelectTrigger className="pl-10 bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/50">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-lg border-white/20">
                <SelectItem value="student" className="hover:bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Student</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin" className="hover:bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Admin/Faculty</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isRegisterMode ? "Registering..." : "Signing in..."}</span>
            </div>
          ) : (
            isRegisterMode ? "Register Now" : "Sign In"
          )}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-white/60 text-sm">
          {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
          >
            {isRegisterMode ? "Sign In" : "Register Now"}
          </button>
        </p>
      </motion.div>
    </motion.form>
  )
}
