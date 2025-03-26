import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react'

// Type definitions
interface ActiveExam {
  id: string
  title: string
  dueDate: string
  timeLeft: string
  problems: number
}

interface PastExam {
  id: string
  title: string
  date: string
  problems: number
  score: number
  status: string
}

export default function StudentDashboard() {
  const [activeExams] = useState<ActiveExam[]>([
    {
      id: 'E001',
      title: '알고리즘 중간고사',
      dueDate: '2025-04-15 14:00',
      timeLeft: '2일 3시간',
      problems: 5,
    },
    {
      id: 'E002',
      title: '자료구조 퀴즈',
      dueDate: '2025-03-25 10:00',
      timeLeft: '5시간',
      problems: 3,
    },
  ])

  const [pastExams] = useState<PastExam[]>([
    {
      id: 'E003',
      title: '프로그래밍 실습',
      date: '2025-03-10',
      problems: 4,
      score: 85,
      status: 'completed',
    },
    {
      id: 'E004',
      title: 'C++ 기초 테스트',
      date: '2025-02-20',
      problems: 3,
      score: 100,
      status: 'completed',
    },
    {
      id: 'E005',
      title: '알고리즘 기초',
      date: '2025-02-05',
      problems: 5,
      score: 70,
      status: 'completed',
    },
  ])

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">학생 대시보드</h1>
        <div className="flex gap-2">
          <Button variant="outline">내 계정</Button>
          <Button variant="outline">로그아웃</Button>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="active">진행 중인 시험</TabsTrigger>
          <TabsTrigger value="past">지난 시험</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">진행 중인 시험</h2>
            <p className="text-muted-foreground">
              현재 참여 가능한 시험 목록입니다.
            </p>
          </div>

          {activeExams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeExams.map((exam) => (
                <Card key={exam.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>마감: {exam.dueDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          남은 시간
                        </span>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Clock className="h-4 w-4" />
                          {exam.timeLeft}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          문제 수
                        </span>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <FileText className="h-4 w-4" />
                          {exam.problems}개
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => alert('hello')}>
                      시험 시작
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                현재 진행 중인 시험이 없습니다.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">지난 시험</h2>
            <p className="text-muted-foreground">
              이전에 참여한 시험 목록입니다.
            </p>
          </div>

          {pastExams.length > 0 ? (
            <div className="space-y-4">
              {pastExams.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-medium">{exam.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>날짜: {exam.date}</span>
                        <span>문제 수: {exam.problems}개</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          {exam.score >= 80 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="font-medium">{exam.score}/100</span>
                        </div>
                        <Badge
                          variant={exam.score >= 80 ? 'default' : 'secondary'}
                          className={`mt-1 ${
                            exam.score >= 80
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-yellow-500 hover:bg-yellow-600'
                          }`}
                        >
                          {exam.score >= 80 ? '통과' : '미달'}
                        </Badge>
                      </div>
                      <Button variant="outline" onClick={() => alert('hello')}>
                        결과 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                지난 시험 기록이 없습니다.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
