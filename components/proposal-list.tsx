"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { ThumbsUp, ThumbsDown, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock data for proposals
const mockProposals = [
  {
    id: 1,
    title: "CIE Workshop Series Funding",
    description:
      "Allocate 5 ETH from the treasury for the upcoming workshop series on blockchain development and smart contract security.",
    forVotes: 1250000,
    againstVotes: 450000,
    deadline: Date.now() + 86400000 * 3, // 3 days from now
    executed: false,
    hasVoted: false,
  },
  {
    id: 2,
    title: "Hackathon Sponsorship",
    description:
      "Sponsor the upcoming engineering hackathon with 10 ETH prize pool to promote innovation in decentralized applications.",
    forVotes: 980000,
    againstVotes: 720000,
    deadline: Date.now() + 86400000 * 5, // 5 days from now
    executed: false,
    hasVoted: false,
  },
  {
    id: 3,
    title: "CIE Membership NFT Collection",
    description:
      "Create a membership NFT collection for CIE members to provide exclusive access to events, workshops, and resources.",
    forVotes: 1500000,
    againstVotes: 250000,
    deadline: Date.now() - 86400000 * 2, // 2 days ago
    executed: true,
    hasVoted: true,
  },
]

type Proposal = {
  id: number
  title: string
  description: string
  forVotes: number
  againstVotes: number
  deadline: number
  executed: boolean
  hasVoted: boolean
}

interface ProposalListProps {
  walletAddress: string
}

export function ProposalList({ walletAddress }: ProposalListProps) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)

  // Simulate loading proposals
  useEffect(() => {
    const timer = setTimeout(() => {
      setProposals(mockProposals)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleVote = (proposalId: number, support: boolean) => {
    setIsVoting(true)

    // Simulate voting delay
    setTimeout(() => {
      setProposals(
        proposals.map((proposal) => {
          if (proposal.id === proposalId) {
            return {
              ...proposal,
              forVotes: support ? proposal.forVotes + 10000 : proposal.forVotes,
              againstVotes: !support ? proposal.againstVotes + 10000 : proposal.againstVotes,
              hasVoted: true,
            }
          }
          return proposal
        }),
      )

      setIsVoting(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-primary/10">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 bg-secondary" />
              <Skeleton className="h-4 w-1/2 bg-secondary" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full bg-secondary" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full bg-secondary" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No proposals found in this DAO.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => {
        const totalVotes = proposal.forVotes + proposal.againstVotes
        const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0
        const isActive = proposal.deadline > Date.now() && !proposal.executed

        return (
          <Card key={proposal.id} className="border-primary/20 overflow-hidden">
            <div className="h-1 bg-primary w-full"></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{proposal.title}</CardTitle>
                  <CardDescription>Proposal #{proposal.id}</CardDescription>
                </div>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={isActive ? "bg-primary text-primary-foreground" : ""}
                >
                  {isActive ? "Active" : "Closed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{proposal.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>For: {proposal.forVotes.toLocaleString()}</span>
                  <span>Against: {proposal.againstVotes.toLocaleString()}</span>
                </div>
                <Progress value={forPercentage} className="h-2 bg-secondary" indicatorClassName="bg-primary" />
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {proposal.deadline > Date.now()
                  ? `Ends ${formatDistanceToNow(proposal.deadline, { addSuffix: true })}`
                  : `Ended ${formatDistanceToNow(proposal.deadline, { addSuffix: true })}`}
              </div>
            </CardContent>
            <CardFooter>
              {isActive && !proposal.hasVoted ? (
                <div className="flex gap-2 w-full">
                  <Button className="flex-1" onClick={() => handleVote(proposal.id, true)} disabled={isVoting}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Vote For
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => handleVote(proposal.id, false)}
                    disabled={isVoting}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Vote Against
                  </Button>
                </div>
              ) : (
                <div className="w-full text-center text-sm text-muted-foreground">
                  {proposal.hasVoted ? "You have already voted on this proposal" : "Voting is closed for this proposal"}
                </div>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

