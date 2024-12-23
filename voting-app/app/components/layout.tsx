import React, { Suspense, useEffect } from 'react'
import Logo from './ui/logo'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from 'contexts/AuthContext'
import { Button } from './ui/button'


interface PublicLayoutProps {
	children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const auth = useAuth()
	const { isAuthenticated, isAdmin, logout, user } = auth
	if (!isAuthenticated && (pathname.includes('vote'))) {
		navigate('/signin')
	}
	if (pathname.includes('admin') && !isAdmin) {
		navigate('/signin')
	}



	return (
		<div className="h-screen flex-col">
			<div className="relative flex flex-row justify-between top-0 left-0 w-full py-4 px-6 max-w-[1980px] mx-auto">
				<div className="flex ">
					<Logo />
					{
						isAdmin &&
						<>
							<Link to="/admin/contract" className="ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Contract</Link>
							<Link to="/admin/candidates" className="ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Υποψήφιοι</Link>
							<Link to="/admin/import-voters" className="ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Εισαγωγή Ψηφοφόρων</Link>
						</>
					}
					{!isAdmin && isAuthenticated && <Link to="/vote" className="ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Ψηφίστε</Link>}
					{/*<Link to="/vote" className="ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Vote</Link> */}
					<Link to="/results" className="ml-8 pt-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Αποτελέσματα</Link>
				</div>

				{isAuthenticated &&
					<div className="flex items-center space-x-4">
						<div>Έχετε συνδεθεί ως {user?.username}</div>
						<Button
							onClick={() => {
								try {
									logout()

								} catch (e) {
									console.error(e)

								}
							}}
						>
							Αποσύνδεση
						</Button>
					</div>
				}
				{!isAuthenticated &&
					<div className="flex items-center space-x-4">
						<Link to="/signin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Σύνδεση</Link>
						<Link to="/signup" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Εγγραφή</Link>
					</div>
				}
			</div>
			<div className='flex justify-center py-16 h-[calc(100%-200px)]'>
				{children}
			</div>

		</div >
	)
}
